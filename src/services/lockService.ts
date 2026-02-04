import { PluncAttributeKeyFormatter } from "../contracts/attributes";
import { EventLockChecker } from "../contracts/elements";
import {
  GLOBAL_EVENT_LOCK_DIRECTIVE,
  GLOBAL_LOCK_ID_DIRECTIVE,
  GLOBAL_LOCK_ID_DIRECTIVE_VALUE,
} from "./pluncAttribute";

/**
 * Creates a function that locks an element by setting a specific attribute.
 * @param attributeKeyFormatter - Formatter function for Plunc attribute keys
 */
export function composeElementLocker(
  attributeKeyFormatter: PluncAttributeKeyFormatter,
) {
  return function lockElement(element: HTMLElement) {
    const attributeKey = attributeKeyFormatter(GLOBAL_LOCK_ID_DIRECTIVE);
    element.setAttribute(attributeKey, GLOBAL_LOCK_ID_DIRECTIVE_VALUE);
  };
}

/**
 * Creates a function that checks if an element is locked.
 * @param attributeKeyFormatter
 * @returns
 */
export function composeIsElementLockedChecker(
  attributeKeyFormatter: PluncAttributeKeyFormatter,
) {
  return function isElementLocked(element: HTMLElement): boolean {
    const attributeKey = attributeKeyFormatter(GLOBAL_LOCK_ID_DIRECTIVE);
    return element.getAttribute(attributeKey) !== null;
  };
}

/**
 * Creates a function that checks if an element is locked to a specific event.
 * @param attributeKeyFormatter
 * @returns
 */
export function composeIsEventLockChecker(
  attributeKeyFormatter: PluncAttributeKeyFormatter,
): EventLockChecker {
  return function isElementLockedToEvent(
    element: HTMLElement,
    eventName: string,
  ) {
    const attribute = attributeKeyFormatter(GLOBAL_EVENT_LOCK_DIRECTIVE);
    const existing = element.getAttribute(attribute);
    if (existing === null) return false;
    const events = existing.split(",");
    return events.includes(eventName);
  };
}

export function composeEventLocker(
  attributeKeyFormatter: PluncAttributeKeyFormatter,
) {
  return function lockElementToEvent(element: HTMLElement, eventName: string) {
    const attributeKey = attributeKeyFormatter(GLOBAL_EVENT_LOCK_DIRECTIVE);
    const existing = element.getAttribute(attributeKey);
    if (existing === null) {
      element.setAttribute(attributeKey, eventName);
      return;
    }
    let events = existing.split(",");
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if (event !== eventName) {
        events.push(eventName);
      }
    }
    element.setAttribute(attributeKey, events.join(","));
  };
}
