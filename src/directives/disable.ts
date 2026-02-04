import { PluncAppContainer } from "../container";
import { DISABLE_ELEMENT_DIRECTIVE } from "../services/pluncAttribute";

export function composeDisableDirectiveProcessor(appCtx: PluncAppContainer) {
  return function processDisableDirective(
    elementCtx: HTMLElement,
    dataCtx: Readonly<{ [key: string]: unknown }>,
  ) {
    const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
      elementCtx,
      DISABLE_ELEMENT_DIRECTIVE,
    );
    elementsToProcess.forEach((element) => {
      if (appCtx.__isElementLocked(element)) {
        return;
      }
      const disableExpression = appCtx.__pluncAttributeValueGetter(
        element,
        DISABLE_ELEMENT_DIRECTIVE,
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
