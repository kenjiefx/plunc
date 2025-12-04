import { ComponentObject } from "../entities/component";
import { Lineage, whoAreTheChildren } from "../entities/lineage";
import { PluncApp } from "../entities/plunc";
import { ComponentId } from "../types";
import { selectElementWithComponentId } from "./elementSelector";
import {
  APP_ATTR,
  createPluncAttribute,
  createPluncAttributeWithValue,
  EVENT_ELEMENT_ATTR,
  LOCK_ID_ATTR_KEY,
  LOCK_ID_ATTR_VALUE,
  STRAWBERRY_ID_ATTR,
} from "./pluncAttribute";

/**
 * Clears all the contents of all existing child components
 * within a certain component.
 * @param cElement - The component element
 * @param childIds - The list of child component IDs
 * @param instance - The PluncApp instance
 * @param elementSelector - The ElementSelector utility
 */
export function clearChildComponents(
  cElement: HTMLElement,
  childIds: Array<ComponentId>,
  instance: PluncApp,
  elementSelector: typeof selectElementWithComponentId
) {
  for (let i = 0; i < childIds.length; i++) {
    const childId = childIds[i];
    const childEl = elementSelector(cElement, childId, instance.config);
    if (childEl !== null) childEl.innerHTML = "";
  }
}

/**
 * Gets the value of an attribute from an element.
 * @param element
 * @param attribute
 * @returns
 */
export function getAttributeValue(
  element: HTMLElement,
  attribute: string
): string | null {
  return element.getAttribute(attribute);
}

/**
 * Creates an HTMLElement through
 * `document.implementation`. A document
 * implementation is used to avoid issues with
 * certain browsers that restrict direct creation
 * of elements.
 * @returns HTMLElement
 */
export function createElement(): HTMLElement {
  return document.implementation.createHTMLDocument().body;
}

/**
 * Binds one element's children to another element
 * @param bindFrom - Element to bind from
 * @param bindTo - Element to bind to
 */
export function copyBindElement(bindFrom: HTMLElement, bindTo: HTMLElement) {
  if (bindFrom === null) return;
  while (bindFrom.childNodes.length > 0) {
    bindTo.appendChild(bindFrom.childNodes[0]);
  }
}

/**
 * Locking ensures that no further processing will be
 * made to the element. This is vital for cases when there
 * are repeat expressions, preserving the integrity.
 * @param element
 * @param attributeFormatter
 */
export function lockElement(
  element: HTMLElement,
  instance: PluncApp,
  createAttr: typeof createPluncAttribute
) {
  const attribute = createAttr(instance, LOCK_ID_ATTR_KEY);
  element.setAttribute(attribute, LOCK_ID_ATTR_VALUE);
}

/**
 * Checks if an element is locked.
 * @param element
 * @param attributeFormatter
 * @returns
 */
export function isElementLocked(
  element: HTMLElement,
  instance: PluncApp,
  createAttr: typeof createPluncAttribute
) {
  const attribute = createAttr(instance, LOCK_ID_ATTR_KEY);
  return element.getAttribute(attribute) !== null;
}

/**
 * Wraps comment block within an element.
 * @param element - Element to be disposed
 * @param comment - Comment you'd like to add
 */
export function disposeElement(element: HTMLElement, comment: string) {
  if (null !== element) {
    element.innerHTML = "";
    if (element.parentNode !== null) {
      element.outerHTML =
        "<!-- plunc.js: " + element.outerHTML + " | " + comment + " -->";
    }
  }
}

/**
 * Scopes and binds an element from one context into another while
 * preserving the inner DOM structure of existing child components.
 *
 * This function is used during component re-renders where the parent
 * component's markup is replaced, but the previously-rendered child
 * components must *not* be destroyed. Instead, their DOM content is
 * temporarily extracted, the parent is re-bound, and the child DOM is
 * restored in place afterward.
 *
 * How it works:
 * It first creates a temporary registry to hold the DOM content of
 * each child component identified by their component IDs. It then
 * clears the target element's content and copies over the new content
 * from the source element. Finally, it restores each child component's
 * DOM content back into the newly-bound parent element.
 *
 * @param bindFromEl - The source element to bind from
 * @param bindToEl - The target element to bind to
 * @param instance - The PluncApp instance
 * @param childIds - The list of child component IDs
 * @param elementSelector - The ElementSelector utility
 */

export function scopeBindElement(
  bindFromEl: HTMLElement,
  bindToEl: HTMLElement,
  instance: PluncApp,
  childIds: Array<ComponentId>,
  elementSelector: typeof selectElementWithComponentId
) {
  // Let's create a temporary registry for child elements
  // to preserve their contents
  const tChildRegistry: { [key: ComponentId]: HTMLElement } = {};

  for (let i = 0; i < childIds.length; i++) {
    const childId = childIds[i];
    const tempChildEl = document.implementation.createHTMLDocument().body;
    const actualChildEl = elementSelector(bindToEl, childId, instance.config);
    if (actualChildEl !== null) {
      copyBindElement(actualChildEl, tempChildEl);
      tChildRegistry[childId] = tempChildEl;
    }
  }

  // Now, we can safely clear the bindToEl
  bindToEl.innerHTML = "";
  copyBindElement(bindFromEl, bindToEl);

  // Restoring back the child elements
  for (const childId in tChildRegistry) {
    const actualChildEl = elementSelector(
      bindToEl,
      childId as ComponentId,
      instance.config
    );
    if (actualChildEl === null) continue;
    copyBindElement(tChildRegistry[childId as ComponentId], actualChildEl);
  }
}

export function isElementEventLocked(
  element: HTMLElement,
  instance: PluncApp,
  eventName: string,
  createAttr: typeof createPluncAttribute
): boolean {
  const attribute = createAttr(instance, EVENT_ELEMENT_ATTR);
  let result = false;
  const existing = element.getAttribute(attribute);
  if (existing === null) return false;
  const events = existing.split(",");
  for (let i = 0; i < events.length; i++) {
    if (eventName === events[i]) {
      result = true;
    }
  }
  return result;
}

export function lockElementEvent(
  element: Element,
  instance: PluncApp,
  eventName: string,
  createAttr: typeof createPluncAttribute
) {
  const attribute = createAttr(instance, EVENT_ELEMENT_ATTR);
  const existing = element.getAttribute(attribute);
  if (existing === null) {
    element.setAttribute(attribute, eventName);
    return;
  }
  let events = existing.split(",");
  for (var i = 0; i < events.length; i++) {
    if (eventName !== events[i]) {
      events.push(eventName);
    }
  }
  element.setAttribute(attribute, events.join(","));
}

/**
 * Selects elements with a certain attribute but not those
 * that are children of certain components.
 *
 * How this works?
 * The selector is built by excluding all child component IDs
 * from the lineage of the given component. This ensures that
 * only elements that are direct children of the specified
 * component are selected, avoiding any nested child components.
 *
 * @param attrWithValue
 * @param component
 * @param lineage
 * @param instance
 * @param attributeFormatter
 * @param elementSelector
 * @param getXAppElement
 * @returns
 */
export function selectElementsButNotChildOfComponent(
  attrWithValue: string,
  component: ComponentObject,
  lineage: Lineage,
  instance: PluncApp,
  createAttrWithValue: typeof createPluncAttributeWithValue,
  elementSelector: typeof selectElementWithComponentId,
  getXAppElementFn: typeof getXAppElement
): NodeListOf<Element> | null {
  const childIds = whoAreTheChildren(lineage, component.id);
  let selector = "";
  for (let i = 0; i < childIds.length; i++) {
    const childId = childIds[i];
    const childAttrName = createAttrWithValue(
      instance,
      STRAWBERRY_ID_ATTR,
      childId
    );
    selector += ":not([" + childAttrName + "])";
  }
  selector += ` > [${attrWithValue}]`;

  if (childIds.length === 0) {
    const xidAttrName = createAttrWithValue(
      instance,
      STRAWBERRY_ID_ATTR,
      component.id
    );
    selector = `[${xidAttrName}] [${attrWithValue}]`;
  }

  const componentElement = elementSelector(
    getXAppElementFn(instance, createAttrWithValue),
    component.id,
    instance.config
  );
  if (componentElement === null) return null;
  return componentElement.querySelectorAll(selector);
}

/**
 * Returns the element within the DOM body with the attribute
 * `plunc-app`, or depending of what prefix being used
 */
export function getXAppElement(
  instance: PluncApp,
  createAttrWithValue: typeof createPluncAttributeWithValue
): HTMLElement {
  const name = `${instance.name}`;
  const selector = `[${createAttrWithValue(instance, APP_ATTR, name)}]`;
  const elements = document.querySelectorAll<HTMLElement>(`${selector.trim()}`);
  if (elements.length === 0) throw new Error("100");
  if (elements.length > 1) throw new Error("101");
  return elements[0];
}
