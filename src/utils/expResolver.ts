import { PluncElement } from "../entities/element";
import { ComponentScope } from "../types";

type ResolveType =
  | "string"
  | "number"
  | "conditional"
  | "boolean"
  | "object"
  | "operation"
  | "function";

export type ExpressionResolver = typeof resolveExpression;

/**
 * Resolves an expression based on a given object
 * @param object baseObj
 * @param string expression
 *
 * @returns the value of the resolved expression
 */
export const resolveExpression = (
  scope: ComponentScope,
  expression: string,
  element: Element | null = null
) => {
  const resolveType = getResolveType(expression);
  return resolve(scope, expression, resolveType, element);
};

/**
 * Determines the type of an expression
 * @param string expression
 * @returns type of expression
 *
 * @NOTE: the expression should always have to be a string!
 */
export function getResolveType(expression: any): ResolveType {
  if (/^'.*'$/.test(expression)) return "string";
  if (!isNaN(expression)) return "number";
  if (expression.includes("(") && expression.includes("=="))
    return "conditional";
  if (expression.includes("(") && expression.includes("is "))
    return "conditional";
  if (expression.includes("(") && expression.includes(">"))
    return "conditional";
  if (expression.includes("(") && expression.includes("<"))
    return "conditional";
  if (expression.includes("(")) return "function";
  if (expression.includes("==")) return "conditional";
  if (expression.includes("is ")) return "conditional";
  if (expression.includes(">")) return "conditional";
  if (expression.includes("<")) return "conditional";
  if (
    expression.includes("+") ||
    expression.includes("-") ||
    expression.includes("/") ||
    expression.includes("*") ||
    expression.includes("%")
  ) {
    return "operation";
  }
  if (expression == "false" || expression == "true" || expression == "null") {
    return "boolean";
  }
  return "object";
}

function resolve(
  scope: ComponentScope,
  expression: string,
  resolveType: ResolveType,
  element: Element | null = null
): any {
  switch (resolveType) {
    case "string":
      return expression.slice(1, -1);
      break;

    case "boolean":
      if (expression == "true") return true;
      if (expression == "false") return false;
      if (expression == "null") return null;
      break;

    case "object":
      return evalObject(scope, expression);
      break;

    case "function":
      let structure = expression.split("(");
      /** Checks to see if structure of a function resembles an object **/
      let expressionTest = structure[0].split(".");
      /** If the said function is a method of an object **/
      if (expressionTest.length > 1) {
        let refObject = resolveExpression(
          scope,
          getParentObjectExp(structure[0])
        );
        let funcExpression = expression
          .split(".")
          .slice(expressionTest.length - 1)
          .join(".");
        return invokeFunction(refObject, scope, funcExpression, element);
      }
      if (!scope.hasOwnProperty(structure[0])) {
        return "";
      }
      return invokeFunction(scope, scope, expression, element);
      break;

    case "conditional":
      const evaluatorMap = {
        "!==": areTwoExpressionsNotTheSame,
        "==": areTwoExpressionsTheSame,
        "is not ": areTwoExpressionsNotTheSame,
        "is ": areTwoExpressionsTheSame,
        ">=": isGreaterThanOrEqualToTheOther,
        ">": isGreaterThanTheOther,
        "<=": isLessThanOrEqualToTheOther,
        "<": isLessThanTheOther,
      };
      for (const comparator in evaluatorMap) {
        if (expression.includes(comparator)) {
          return evaluatorMap[comparator as keyof typeof evaluatorMap](
            scope,
            expression,
            comparator
          );
        }
      }
      return false;
      break;

    case "number":
      return Number(expression);
      break;

    case "operation":
      let finalExpression = expression;
      let operations = ["+", "-", "*", "/", "%"];
      for (var i = 0; i < operations.length; i++) {
        if (expression.includes(operations[i])) {
          let exp = expression.split(operations[i]);
          let left = resolveExpression(scope, exp[0].trim());
          var right = resolveExpression(scope, exp[1].trim());
          finalExpression = left + operations[i] + right;
        }
      }
      return eval(finalExpression);
      break;

    default:
      break;
  }
}

function evalObject(scope: ComponentScope, expression: string) {
  if (expression === "$scope") {
    return scope;
  }
  return expression.split(".").reduce(function (o, x) {
    if (o === undefined) return;
    if (o === null) return;
    if (o[x] === undefined) return;
    return o[x];
  }, scope);
}

/**
 * Invokes/calls a given function based on the function expression
 *
 * @param object refObject - The object where the function to invoke is a member of
 * @param object argScope - The object where we can reference the argument expression
 * of the function to invoke
 * @param string functionExpression - The function expression, for example
 * myFunction(arg)
 */
function invokeFunction(
  scope: ComponentScope,
  object: { [key: string]: any },
  expression: string,
  element: Element | null
): any {
  /**
   * @TODO Need to check cases where this returns undefined
   * One example,this returns undefined in cases when the
   * repeats are nested together
   */
  if (scope === undefined) return "";

  /** Parses function structure **/
  const splitExpression = expression.match(/\(([^)]+)\)/);
  let struct = expression.split("(");
  let name = struct[0];

  /** If function has an argument */
  if (splitExpression !== null) {
    const argsVault = new Array();
    const splitArguments = splitExpression[1].split(",");
    for (let i = 0; i < splitArguments.length; i++) {
      argsVault.push(resolveExpression(object, splitArguments[i].trim()));
    }
    if (element !== null) {
      argsVault.push(new PluncElement(element));
    }
    // Checks if the given is a function
    if (!(scope[name] instanceof Function)) {
      return "";
    }
    return scope[name](...argsVault);
  }

  // When there is no argument added to the function, and
  // if there is an element passed to the Resolver
  // that means that we need to add the element as one of the
  // arguments of the referenced function to call
  if (element !== null) {
    // Function argument holder
    const argsVault = new Array();
    argsVault.push(new PluncElement(element));
    return scope[name](...argsVault);
  }
  if (!(scope[name] instanceof Function)) {
    return "";
  }
  // If it has no argument, and no Element object is required to
  // be passed as argument to the referenced function to
  return scope[name]();
}

function getParentObjectExp(expression: string) {
  let pieces = expression.split(".");
  if (pieces.length < 2) return "$scope";
  pieces.pop();
  return pieces.join(".");
}

export function getParentObjAsObject(base: object, expression: string) {
  const parentObjExp = getParentObjectExp(expression);
  return resolveExpression(base, parentObjExp);
}

export function getChildObjectExp(expression: string) {
  let pieces = expression.split(".");
  return pieces[pieces.length - 1];
}

export function areTwoExpressionsTheSame(
  scope: ComponentScope,
  expression: string,
  comparator: string
): boolean {
  const [left, right] = expression.split(comparator).map((arm) => {
    return resolveExpression(scope, arm.trim());
  });
  return left === right;
}

function areTwoExpressionsNotTheSame(
  scope: ComponentScope,
  expression: string,
  comparator: string
): boolean {
  const [left, right] = expression.split(comparator).map((arm) => {
    return resolveExpression(scope, arm.trim());
  });
  return left !== right;
}

function isGreaterThanTheOther(
  scope: ComponentScope,
  expression: string,
  comparator: string
): boolean {
  const [left, right] = expression.split(comparator).map((arm) => {
    return resolveExpression(scope, arm.trim());
  });
  return left > right;
}

function isGreaterThanOrEqualToTheOther(
  scope: ComponentScope,
  expression: string,
  comparator: string
): boolean {
  const [left, right] = expression.split(comparator).map((arm) => {
    return resolveExpression(scope, arm.trim());
  });
  return left >= right;
}

function isLessThanTheOther(
  scope: ComponentScope,
  expression: string,
  comparator: string
): boolean {
  const [left, right] = expression.split(comparator).map((arm) => {
    return resolveExpression(scope, arm.trim());
  });
  return left < right;
}

function isLessThanOrEqualToTheOther(
  scope: ComponentScope,
  expression: string,
  comparator: string
): boolean {
  const [left, right] = expression.split(comparator).map((arm) => {
    return resolveExpression(scope, arm.trim());
  });
  return left <= right;
}
