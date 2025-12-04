import { ComponentObject, createComponentFactory } from "../entities/component";
import { PluncApp } from "../entities/plunc";
import { ComponentId, ComponentScope } from "../types";
import {
  copyBindElement,
  createElement,
  getAttributeValue,
} from "../utils/elementHelper";
import { selectAllElementsByAttribute } from "../utils/elementSelector";
import { ExpressionResolver, resolveExpression } from "../utils/expResolver";
import {
  createPluncAttribute,
  REPEAT_ELEMENT_ATTR,
  REPEAT_REFERENCE_TOKEN,
} from "../utils/pluncAttribute";
import { RenderHelpers } from "../utils/renderHelpers";
import { startRendering } from "./renderer";

/**
 * Dissects repeat expression into two parts, refObjName and aliasObjName.
 * For example, `users as user` will be dissected
 * into `['users', 'user']`. Similarly, `item until 3`
 * will be dissected into `['item', 3]`
 * @param expression
 * @returns
 */
export function dissectRepeatExpression(expression: string): Array<string> {
  if (expression.includes("until ")) {
    return [REPEAT_REFERENCE_TOKEN, expression.split("until")[1].trim()];
  }
  return [
    expression.split(" as ")[0].trim(),
    expression.split(" as ")[1].trim(),
  ];
}

/**
 * Calculates number of repetitions based on the type of
 * repeatable value.
 * @param repetitions
 * @returns
 */
export function calculateNumberOfRepetitions(repetitions: unknown) {
  if (repetitions instanceof Array) return repetitions.length;
  if (typeof repetitions === "number" && Number.isInteger(repetitions))
    return repetitions;
  throw new Error(`repeatable elements must have repeatable values`);
}

/**
 * This function simply checks if a value is iterable
 * with `Object.entries`.
 * @param value
 */
export function isIterableWithObjectEntries(value: unknown): boolean {
  return value !== null && (typeof value === "object" || Array.isArray(value));
}

/**
 * Renders all repeatable elements within a given element context.
 */
export function renderRepeats(
  elementContext: HTMLElement,
  componentObject: ComponentObject,
  pluncAppInstance: PluncApp,
  createAttr: typeof createPluncAttribute,
  selectAllByAttribute: typeof selectAllElementsByAttribute,
  getAttrValue: typeof getAttributeValue,
  resolveExp: typeof resolveExpression,
  dissectRepeatExp: typeof dissectRepeatExpression,
  calcNumOfRep: typeof calculateNumberOfRepetitions,
  isIterable: typeof isIterableWithObjectEntries,
  createComponentFn: ReturnType<typeof createComponentFactory>,
  createElementFn: typeof createElement,
  copyBindElementFn: typeof copyBindElement,
  recursiveRenderFn: typeof startRendering,
  renderHelpers: RenderHelpers
): void {
  const repeatAttribute = createAttr(pluncAppInstance, REPEAT_ELEMENT_ATTR);
  const repeatableElements = selectAllByAttribute(
    elementContext,
    repeatAttribute
  );

  const scope = componentObject.scope;
  // Do nothing with the element context if there's no repeatable elements
  if (scope === null) return;

  for (let i = 0; i < repeatableElements.length; i++) {
    const repeatableElement = repeatableElements[i];
    const templateCopy = repeatableElement.innerHTML;
    repeatableElement.innerHTML = "";

    const repeatExpression = getAttrValue(repeatableElement, repeatAttribute);

    if (repeatExpression === null || repeatExpression.trim() === "") continue;

    const [refObjName, aliasObjName] = dissectRepeatExp(repeatExpression);

    if (refObjName === REPEAT_REFERENCE_TOKEN) {
      // This retrieves the object that we can loop through
      const repetitions = resolveExp(scope, aliasObjName);
      // Tells us how many times to repeat
      const numberOfRepetitions = calcNumOfRep(repetitions);
      scope["$$index"] = 0;
      let k = 0;
      while (k < numberOfRepetitions)
        scope["$$index"]["props" + k++] = new Object();
    }

    const repeatableValue = resolveExp(scope, refObjName);
    if (!isIterable(repeatableValue)) continue;

    let indexNum = 0;
    for (const [key, value] of Object.entries(repeatableValue)) {
      // Creating temporary, dummy component for each repititions
      const id = "any" as ComponentId;
      const component = createComponentFn(id, "dummy");
      component.scope = {
        $parent: scope,
        $index: indexNum++,
        [aliasObjName]: value,
      };
      const childTemplate = createElementFn();
      childTemplate.innerHTML = templateCopy;

      // Render the children within the repeatable element
      recursiveRenderFn(
        childTemplate,
        component,
        pluncAppInstance,
        renderHelpers
      );

      // Bind the rendered children to the repeatable element
      copyBindElementFn(childTemplate, repeatableElement);
    }
  }
}
