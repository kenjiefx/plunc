import {
  PluncAttributeKeyFormatter,
  LOCK_ID_ATTR_KEY,
  LOCK_ID_ATTR_VALUE,
  EVENT_ELEMENT_ATTR,
} from "./pluncAttribute";

/**
 * Function type for locking an element. Locking ensures that no further processing will be
 * made to the element. This is vital for cases when there
 * are repeat expressions, preserving the integrity.
 */
export type ElementLocker = (element: HTMLElement) => void;

/**
 * Creates a function that locks an element by setting a specific attribute.
 * @param attributeKeyFormatter - Formatter function for Plunc attribute keys
 */
export function composeElementLocker(
  attributeKeyFormatter: PluncAttributeKeyFormatter,
) {
  return function lockElement(element: HTMLElement) {
    const attributeKey = attributeKeyFormatter(LOCK_ID_ATTR_KEY);
    element.setAttribute(attributeKey, LOCK_ID_ATTR_VALUE);
  };
}

/**
 * Function type for checking if an element is locked.
 */
export type IsElementLockedChecker = (element: HTMLElement) => boolean;

/**
 * Creates a function that checks if an element is locked.
 * @param attributeKeyFormatter
 * @returns
 */
export function composeIsElementLockedChecker(
  attributeKeyFormatter: PluncAttributeKeyFormatter,
) {
  return function isElementLocked(element: HTMLElement): boolean {
    const attributeKey = attributeKeyFormatter(LOCK_ID_ATTR_KEY);
    return element.getAttribute(attributeKey) !== null;
  };
}

export type EventLockChecker = (
  element: HTMLElement,
  eventName: string,
) => boolean;

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
    const attribute = attributeKeyFormatter(EVENT_ELEMENT_ATTR);
    const existing = element.getAttribute(attribute);
    if (existing === null) return false;
    const events = existing.split(",");
    return events.includes(eventName);
  };
}

export type EventLocker = (element: HTMLElement, eventName: string) => void;

export function createEventLocker(
  attributeKeyFormatter: PluncAttributeKeyFormatter,
) {}
