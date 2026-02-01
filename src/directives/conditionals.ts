import { PluncAppContainer } from "../container";
import { IF_ELEMENT_DIRECTIVE } from "../services/pluncAttribute";

export function composeConditionalDirectivesProcessor(
  appCtx: PluncAppContainer,
) {
  return function processConditionalDirectives(
    elementCtx: HTMLElement,
    dataCtx: Readonly<{ [key: string]: unknown }>,
  ) {
    const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
      elementCtx,
      IF_ELEMENT_DIRECTIVE,
    );
    elementsToProcess.forEach((element) => {
      if (appCtx.__isElementLocked(element)) {
        return;
      }
      const conditionExpression = appCtx.__pluncAttributeValueGetter(
        element,
        IF_ELEMENT_DIRECTIVE,
      );
      if (conditionExpression === null || conditionExpression.trim() === "") {
        return;
      }
      const evaluationResult = appCtx.__resolveExpression(
        dataCtx,
        conditionExpression,
      );
      if (typeof evaluationResult === "boolean" && evaluationResult === false) {
        appCtx.__trashElement(element, `condition evaluated to false`);
      }
      appCtx.__lockElement(element);
    });
  };
}
