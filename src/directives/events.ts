import {
  CLICK_EVENT_DIRECTIVE,
  CHANGE_EVENT_DIRECTIVE,
  TOUCH_EVENT_DIRECTIVE,
} from "../services/pluncAttribute";
import { resolvePluncExpression } from "../services/expressionResolver";
import { getExpressionResolveType } from "../services/expressionResolver";
import { PluncAppContainer } from "../container";
import { PluncElement } from "../services/pluncElement";

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
  if (getExpressionResolveType(fnExpression) !== "function") return;
  bindToElement.addEventListener(eventType, () => {
    const pluncElement = new PluncElement(bindToElement);
    resolvePluncExpression(dataCtx, fnExpression, pluncElement);
  });
}

export function composeEventDirectiveProcessor(appCtx: PluncAppContainer) {
  return function processEventDirectives(
    elementCtx: HTMLElement,
    dataCtx: Readonly<{ [key: string]: unknown }>,
  ) {
    const events = [
      { type: "click", attr: CLICK_EVENT_DIRECTIVE },
      { type: "change", attr: CHANGE_EVENT_DIRECTIVE },
      { type: "keyup", attr: TOUCH_EVENT_DIRECTIVE },
    ];
    events.forEach((event) => {
      const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
        elementCtx,
        event.attr,
      );
      elementsToProcess.forEach((element) => {
        if (appCtx.__isElementLockedToEvent(element, event.type)) {
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
        appCtx.__lockElementToEvent(element, event.type);
      });
    });
  };
}
