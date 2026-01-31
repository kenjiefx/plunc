import { PluncAppContext } from "../services/contextBinder";
import { IF_ELEMENT_ATTR } from "../services/pluncAttribute";

export function composeConditionalDirectivesProcessor(appCtx: PluncAppContext) {
  return function processConditionalDirectives(
    elementCtx: HTMLElement,
    dataCtx: Readonly<{ [key: string]: unknown }>,
  ) {
    const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
      elementCtx,
      IF_ELEMENT_ATTR,
    );
    elementsToProcess.forEach((element) => {
      if (appCtx.__isElementLocked(element)) {
        return;
      }
      const conditionExpression = appCtx.__pluncAttributeValueGetter(
        element,
        IF_ELEMENT_ATTR,
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
