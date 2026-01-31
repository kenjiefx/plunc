import { PluncAppContext } from "../services/contextBinder";
import { STYLE_ELEMENT_ATTR } from "../services/pluncAttribute";

export function composeStyleDirectiveProcessor(appCtx: PluncAppContext) {
  /**
   * Collects all elements with the `plunc-style` directive and evaluates the
   * expression provided as the attribute's value. The resulting string is
   * then added to the class list of each element.
   *
   * @example
   * `$scope.printClassNames = () => 'font-3'`
   * `<div plunc-style="printClassNames()">Hello world</div>`
   *
   * will result to:
   * `<div plunc-style="printClassNames()" class="font-3">Hello world</div>`
   *
   */
  return function processStyleDirective(
    elementCtx: HTMLElement,
    dataCtx: Readonly<{ [key: string]: unknown }>,
  ) {
    const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
      elementCtx,
      STYLE_ELEMENT_ATTR,
    );
    elementsToProcess.forEach((element) => {
      if (appCtx.__isElementLocked(element)) {
        return;
      }
      const styleExpression = appCtx.__pluncAttributeValueGetter(
        element,
        STYLE_ELEMENT_ATTR,
      );
      if (styleExpression === null || styleExpression.trim() === "") {
        return;
      }
      const evaluatedResult = appCtx.__resolveExpression(
        dataCtx,
        styleExpression,
      );
      if (
        typeof evaluatedResult === "string" &&
        evaluatedResult.trim() !== ""
      ) {
        const classNames = evaluatedResult.split(" ").map((cn) => cn.trim());
        classNames.forEach((cn) => {
          if (cn !== "") {
            element.classList.add(cn);
          }
        });
      }
      appCtx.__lockElement(element);
    });
  };
}
