import { PluncAppContext } from "../services/contextBinder";
import {
  CLICK_EVENT_ATTR,
  CHANGE_EVENT_ATTR,
  TOUCH_EVENT_ATTR,
} from "../services/pluncAttribute";
import { getResolveType } from "../services/expResolver";
import { resolveExpression } from "../services/expResolver";

/**
 * This function adds event listener to elements which is bound to a function
 * within the component scope
 */
function bindEventListenerToElement(
  dataCtx: Readonly<{ [key: string]: unknown }>,
  bindToElement: HTMLElement,
  fnExpression: string,
  eventType: string,
) {
  if (getResolveType(fnExpression) !== "function") return;
  bindToElement.addEventListener(eventType, () => {
    resolveExpression(dataCtx, fnExpression, bindToElement);
  });
}

export function composeEventDirectiveProcessor(appCtx: PluncAppContext) {
  return function processEventDirectives(
    elementCtx: HTMLElement,
    dataCtx: Readonly<{ [key: string]: unknown }>,
  ) {
    const events = [
      { type: "click", attr: CLICK_EVENT_ATTR },
      { type: "change", attr: CHANGE_EVENT_ATTR },
      { type: "keyup", attr: TOUCH_EVENT_ATTR },
    ];
    events.forEach((event) => {
      const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
        elementCtx,
        event.attr,
      );
      elementsToProcess.forEach((element) => {
        if (appCtx.__isElementLocked(element)) {
          return;
        }
        const fnExpression = appCtx.__pluncAttributeValueGetter(
          element,
          event.attr,
        );
        if (fnExpression === null || fnExpression.trim() === "") {
          return;
        }
        bindEventListenerToElement(dataCtx, element, fnExpression, event.type);
        appCtx.__lockElement(element);
      });
    });
  };
}
