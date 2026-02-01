import { PluncAppContainer } from "../container";
import {
  REPEAT_ELEMENT_DIRECTIVE,
  REPEAT_REFERENCE_TOKEN,
} from "../services/pluncAttribute";
import { PluncAppConfiguration } from "../types";

export function dissectRepeatExpression(expression: string): Array<string> {
  if (expression.includes("until ")) {
    return [REPEAT_REFERENCE_TOKEN, expression.split("until")[1].trim()];
  }
  return [
    expression.split(" as ")[0].trim(),
    expression.split(" as ")[1].trim(),
  ];
}

export function countRepeatable(repetitions: unknown): number {
  if (repetitions instanceof Array) return repetitions.length;
  if (typeof repetitions === "number" && Number.isInteger(repetitions))
    return repetitions;
  throw new Error(`Repeatable elements must have repeatable values`);
}

function isIterableWithEntries(value: unknown): value is object | unknown[] {
  return value !== null && (typeof value === "object" || Array.isArray(value));
}

export function composeRepeatDirectiveProcessor(appCtx: PluncAppContainer) {
  let processDirectivesOnRepeatedElementFn: (
    repeatedElement: HTMLElement,
    repeatedDataCtx: { [key: string]: unknown },
  ) => void = () => {};

  function processRepeatDirective(
    repeatableElementCtx: HTMLElement, // The actual element with the repeat directive
    dataCtx: { [key: string]: unknown },
  ) {
    // Deep copy data context to avoid mutation
    const scope: { [key: string]: any } = Object.assign({}, dataCtx);
    const template = repeatableElementCtx.innerHTML;
    repeatableElementCtx.replaceChildren();
    let repeatExpression = appCtx.__pluncAttributeValueGetter(
      repeatableElementCtx,
      REPEAT_ELEMENT_DIRECTIVE,
    );
    if (repeatExpression === null || repeatExpression.trim() === "") {
      return;
    }
    let [dataSourceExpr, itemAlias] = dissectRepeatExpression(repeatExpression);
    if (dataSourceExpr === REPEAT_REFERENCE_TOKEN) {
      // This creates a new object that we can loop through
      const repetitions = appCtx.__resolveExpression(scope, itemAlias);
      // How many repitions to be made
      let times = countRepeatable(repetitions);
      scope["$$index"] = {};
      let k = 0;
      while (k < times) scope["$$index"]["props" + k++] = new Object();
    }

    const repeatableObject = appCtx.__resolveExpression(scope, dataSourceExpr);

    if (!isIterableWithEntries(repeatableObject)) {
      return;
    }

    let indexNumber = 0;
    for (const [key, value] of Object.entries(repeatableObject)) {
      // Create a new data context for each iteration
      const repeatDataCtx = {
        $parent: dataCtx,
        $index: indexNumber,
        [itemAlias]: value,
      };
      const repeatedElementCtx = appCtx.__createStagingElement(template);
      // Process other directives on the repeated element
      processDirectivesOnRepeatedElementFn(repeatedElementCtx, repeatDataCtx);
      // Append processed element to the repeatable element context
      appCtx.__commitStagingElementTo(repeatedElementCtx, repeatableElementCtx);
      indexNumber++;
    }
  }

  return function processRepeatDirectives(
    elementCtx: HTMLElement, // Parent element that may contain repeat directives
    dataCtx: { [key: string]: unknown },
    processDirectivesOnRepeatedElement: (
      repeatedElement: HTMLElement,
      repeatedDataCtx: { [key: string]: unknown },
    ) => void,
  ) {
    // Get elements with the repeat directive
    const repeatElements = appCtx.__querySelectAllByPluncAttribute(
      elementCtx,
      REPEAT_ELEMENT_DIRECTIVE,
    );
    processDirectivesOnRepeatedElementFn = processDirectivesOnRepeatedElement;
    for (const repeatElement of repeatElements) {
      processRepeatDirective(repeatElement, dataCtx);
    }
  };
}
