import { PluncAppContainer } from "../container";
import { CHECK_ELEMENT_DIRECTIVE } from "../services/pluncAttribute";

export function composeCheckDirectiveProcessor(appCtx: PluncAppContainer) {
  return function processCheckDirective(
    elementCtx: HTMLElement,
    dataCtx: Readonly<{ [key: string]: unknown }>,
  ) {
    const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
      elementCtx,
      CHECK_ELEMENT_DIRECTIVE,
    );
    elementsToProcess.forEach((element) => {
      if (appCtx.__isElementLocked(element)) {
        return;
      }
      const checkExpression = appCtx.__pluncAttributeValueGetter(
        element,
        CHECK_ELEMENT_DIRECTIVE,
      );
      if (checkExpression === null || checkExpression.trim() === "") {
        return;
      }
      const evaluatedResult = appCtx.__resolveExpression(
        dataCtx,
        checkExpression,
      );
      if (typeof evaluatedResult === "boolean") {
        evaluatedResult
          ? element.setAttribute("checked", "true")
          : element.removeAttribute("checked");
      }
      appCtx.__lockElement(element);
    });
  };
}
