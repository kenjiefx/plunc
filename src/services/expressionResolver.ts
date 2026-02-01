import { PluncElement } from "./pluncElement";

type ResolveType =
  | "S" // string
  | "N" // number
  | "C" // conditional
  | "B" // boolean
  | "OB" // object
  | "OP" // operation
  | "F"; // function

export type ExpressionResolver = typeof resolvePluncExpression;

/**
 * Resolves an expression based on a given object
 * @param object baseObj
 * @param string expression
 *
 * @returns the value of the resolved expression
 */
export function resolvePluncExpression(
  dataCtx: { [key: string]: any },
  expression: string,
  element: PluncElement | null = null,
) {
  const resolveType = getExpressionResolveType(expression);
  return initExpressionResolver(dataCtx, expression, resolveType, element);
}

/**
 * Determines the type of an expression
 * @param string expression
 * @returns type of expression
 *
 * @NOTE: the expression should always have to be a string!
 */
export function getExpressionResolveType(expression: any): ResolveType {
  if (/^'.*'$/.test(expression)) return "S";
  if (!isNaN(expression)) return "N";
  if (expression.includes("(") && expression.includes("==")) return "C";
  if (expression.includes("(") && expression.includes("is ")) return "C";
  if (expression.includes("(") && expression.includes(">")) return "C";
  if (expression.includes("(") && expression.includes("<")) return "C";
  if (expression.includes("(")) return "F";
  if (expression.includes("==")) return "C";
  if (expression.includes("is ")) return "C";
  if (expression.includes(">")) return "C";
  if (expression.includes("<")) return "C";
  if (
    expression.includes("+") ||
    expression.includes("-") ||
    expression.includes("/") ||
    expression.includes("*") ||
    expression.includes("%")
  ) {
    return "OP";
  }
  if (expression == "false" || expression == "true" || expression == "null") {
    return "B";
  }
  return "OB";
}

function initExpressionResolver(
  dataCtx: { [key: string]: any },
  expression: string,
  resolveType: ResolveType,
  element: PluncElement | null = null,
): any {
  switch (resolveType) {
    case "S":
      return expression.slice(1, -1);
      break;

    case "B":
      if (expression == "true") return true;
      if (expression == "false") return false;
      if (expression == "null") return null;
      break;

    case "OB":
      return evaluateObject(dataCtx, expression);
      break;

    case "F":
      let structure = expression.split("(");
      /** Checks to see if structure of a function resembles an object **/
      let expressionTest = structure[0].split(".");
      /** If the said function is a method of an object **/
      if (expressionTest.length > 1) {
        let refObject = resolvePluncExpression(
          dataCtx,
          getParentObjectExp(structure[0]),
        );
        let funcExpression = expression
          .split(".")
          .slice(expressionTest.length - 1)
          .join(".");
        return invokeFunction(refObject, dataCtx, funcExpression, element);
      }
      if (!Object.prototype.hasOwnProperty.call(dataCtx, structure[0])) {
        return "";
      }
      return invokeFunction(dataCtx, dataCtx, expression, element);
      break;

    case "C":
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
            dataCtx,
            expression,
            comparator,
          );
        }
      }
      return false;
      break;

    case "N":
      return Number(expression);
      break;

    case "OP":
      let finalExpression = expression;
      let operations = ["+", "-", "*", "/", "%"];
      for (var i = 0; i < operations.length; i++) {
        if (expression.includes(operations[i])) {
          let exp = expression.split(operations[i]);
          let left = resolvePluncExpression(dataCtx, exp[0].trim());
          var right = resolvePluncExpression(dataCtx, exp[1].trim());
          finalExpression = left + operations[i] + right;
        }
      }
      return eval(finalExpression);
      break;

    default:
      break;
  }
}

function evaluateObject(dataCtx: { [key: string]: any }, expression: string) {
  if (expression === "$dataCtx") {
    return dataCtx;
  }
  return expression.split(".").reduce(function (o, x) {
    if (o === undefined) return;
    if (o === null) return;
    if (o[x] === undefined) return;
    return o[x];
  }, dataCtx);
}

/**
 * Invokes/calls a given function based on the function expression
 *
 * @param object refObject - The object where the function to invoke is a member of
 * @param object argdataCtx - The object where we can reference the argument expression
 * of the function to invoke
 * @param string functionExpression - The function expression, for example
 * myFunction(arg)
 */
function invokeFunction(
  dataCtx: { [key: string]: any },
  object: { [key: string]: any },
  expression: string,
  element: PluncElement | null,
): any {
  /**
   * @TODO Need to check cases where this returns undefined
   * One example,this returns undefined in cases when the
   * repeats are nested together
   */
  if (dataCtx === undefined) return "";

  /** Parses function structure **/
  const splitExpression = expression.match(/\(([^)]+)\)/);
  let struct = expression.split("(");
  let name = struct[0];

  /** If function has an argument */
  if (splitExpression !== null) {
    const argsVault = new Array();
    const splitArguments = splitExpression[1].split(",");
    for (let i = 0; i < splitArguments.length; i++) {
      argsVault.push(resolvePluncExpression(object, splitArguments[i].trim()));
    }
    if (element !== null) {
      argsVault.push(element);
    }
    // Checks if the given is a function
    if (!(dataCtx[name] instanceof Function)) {
      return "";
    }
    return dataCtx[name](...argsVault);
  }

  // When there is no argument added to the function, and
  // if there is an element passed to the Resolver
  // that means that we need to add the element as one of the
  // arguments of the referenced function to call
  if (element !== null) {
    // Function argument holder
    const argsVault = new Array();
    argsVault.push(element);
    return dataCtx[name](...argsVault);
  }
  if (!(dataCtx[name] instanceof Function)) {
    return "";
  }
  // If it has no argument, and no Element object is required to
  // be passed as argument to the referenced function to
  return dataCtx[name]();
}

function getParentObjectExp(expression: string) {
  let pieces = expression.split(".");
  if (pieces.length < 2) return "$dataCtx";
  pieces.pop();
  return pieces.join(".");
}

export function getParentObjAsObject(base: object, expression: string) {
  const parentObjExp = getParentObjectExp(expression);
  return resolvePluncExpression(base, parentObjExp);
}

export function getChildObjectExp(expression: string) {
  let pieces = expression.split(".");
  return pieces[pieces.length - 1];
}

export function areTwoExpressionsTheSame(
  dataCtx: { [key: string]: any },
  expression: string,
  comparator: string,
): boolean {
  const [left, right] = expression.split(comparator).map((arm) => {
    return resolvePluncExpression(dataCtx, arm.trim());
  });
  return left === right;
}

function areTwoExpressionsNotTheSame(
  dataCtx: { [key: string]: any },
  expression: string,
  comparator: string,
): boolean {
  const [left, right] = expression.split(comparator).map((arm) => {
    return resolvePluncExpression(dataCtx, arm.trim());
  });
  return left !== right;
}

function isGreaterThanTheOther(
  dataCtx: { [key: string]: any },
  expression: string,
  comparator: string,
): boolean {
  const [left, right] = expression.split(comparator).map((arm) => {
    return resolvePluncExpression(dataCtx, arm.trim());
  });
  return left > right;
}

function isGreaterThanOrEqualToTheOther(
  dataCtx: { [key: string]: any },
  expression: string,
  comparator: string,
): boolean {
  const [left, right] = expression.split(comparator).map((arm) => {
    return resolvePluncExpression(dataCtx, arm.trim());
  });
  return left >= right;
}

function isLessThanTheOther(
  dataCtx: { [key: string]: any },
  expression: string,
  comparator: string,
): boolean {
  const [left, right] = expression.split(comparator).map((arm) => {
    return resolvePluncExpression(dataCtx, arm.trim());
  });
  return left < right;
}

function isLessThanOrEqualToTheOther(
  dataCtx: { [key: string]: any },
  expression: string,
  comparator: string,
): boolean {
  const [left, right] = expression.split(comparator).map((arm) => {
    return resolvePluncExpression(dataCtx, arm.trim());
  });
  return left <= right;
}
