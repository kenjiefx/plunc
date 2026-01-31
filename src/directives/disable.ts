import { PluncAppContext } from "../services/contextBinder";
import { DISABLE_ELEMENT_ATTR } from "../services/pluncAttribute";

export function composeDisableDirectiveProcessor(appCtx: PluncAppContext) {
  return function processDisableDirective(
    elementCtx: HTMLElement,
    dataCtx: Readonly<{ [key: string]: unknown }>,
  ) {
    const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
      elementCtx,
      DISABLE_ELEMENT_ATTR,
    );
    elementsToProcess.forEach((element) => {
      if (appCtx.__isElementLocked(element)) {
        return;
      }
      const disableExpression = appCtx.__pluncAttributeValueGetter(
        element,
        DISABLE_ELEMENT_ATTR,
      );
      if (disableExpression === null || disableExpression.trim() === "") {
        return;
      }
      const evaluatedResult = appCtx.__resolveExpression(
        dataCtx,
        disableExpression,
      );
      if (typeof evaluatedResult === "boolean") {
        evaluatedResult
          ? element.setAttribute("disabled", "true")
          : element.removeAttribute("disabled");
      }
      appCtx.__lockElement(element);
    });
  };
}
