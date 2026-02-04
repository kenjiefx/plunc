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
  if (getExpressionResolveType(fnExpression) !== "F") return;
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
      { t: "click", a: CLICK_EVENT_DIRECTIVE },
      { t: "change", a: CHANGE_EVENT_DIRECTIVE },
      { t: "keyup", a: TOUCH_EVENT_DIRECTIVE },
    ];
    events.forEach((event) => {
      const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
        elementCtx,
        event.a,
      );
      elementsToProcess.forEach((element) => {
        if (appCtx.__isElementLockedToEvent(element, event.t)) {
          return;
        }

        const fnExpression = appCtx.__pluncAttributeValueGetter(
          element,
          event.a,
        );
        if (fnExpression === null || fnExpression.trim() === "") {
          return;
        }
        bindEventListenerToElement(dataCtx, element, fnExpression, event.t);
        appCtx.__lockElementToEvent(element, event.t);
      });
    });
  };
}
