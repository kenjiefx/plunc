import { ComponentId, PluncAttributeKey, StagingHTMLElement } from "../types";
import {
  GLOBAL_ATTR_FOR_APP_NAME,
  PluncAttributeKeyFormatter,
} from "./pluncAttribute";

/**
 * Selects an element within the given context using the provided CSS selector.
 * @param context - Document or HTMLElement to search within
 * @param selector - CSS selector string to match the element
 */
export type ElementSelector = (
  context: HTMLElement,
  selector: string,
) => HTMLElement | null;

export function selectElement(
  context: HTMLElement,
  selector: string,
): HTMLElement | null {
  return context.querySelector<HTMLElement>(selector);
}

/**
 * Selects all elements within the given context that match the provided CSS selector.
 * @param context
 * @param selector
 */
export type ElementsSelector = (
  context: HTMLElement,
  selector: string,
) => HTMLElement[];

export function selectAllElements(
  context: HTMLElement,
  selector: string,
): HTMLElement[] {
  return Array.from(context.querySelectorAll<HTMLElement>(selector));
}

export function composeAllElementsSelector(
  selectElementsFn: typeof selectAllElements,
) {
  return function (context: HTMLElement, selector: string): HTMLElement[] {
    return selectElementsFn(context, selector);
  };
}

export type ElementsSelectorWithPluncAttribute = (
  context: HTMLElement,
  pluncAttributeKey: string,
  pluncAttributeValue?: string,
) => HTMLElement[];

export function composeElementSelectorsWithPluncAttribute(
  selectAllElementFn: ElementsSelector,
  formatPluncAttributeFn: PluncAttributeKeyFormatter,
) {
  return function selectAllElementsWithPluncAttribute(
    context: HTMLElement,
    pluncAttributeKey: string,
    pluncAttributeValue?: string,
  ): HTMLElement[] {
    const attributeKey = formatPluncAttributeFn(pluncAttributeKey);
    const valuePart = pluncAttributeValue ? `="${pluncAttributeValue}"` : "";
    const selector = `[${attributeKey}${valuePart}]`;
    return selectAllElementFn(context, selector);
  };
}

/**
 * Function type for getting the value of a Plunc attribute from an element
 * @param element - The HTML element to retrieve the attribute from
 * @param key - The Plunc attribute key
 */
export type PluncAttributeValueGetter = (
  element: HTMLElement,
  key: string,
) => string | null;

export function composePluncAttributeValueGetter(
  formatPluncAttributeFn: PluncAttributeKeyFormatter,
) {
  return function getPluncAttributeValue(
    element: HTMLElement,
    key: string,
  ): string | null {
    const attributeKey = formatPluncAttributeFn(key);
    return element.getAttribute(attributeKey);
  };
}

export type PluncAttributeValueSetter = (
  element: HTMLElement,
  key: string,
  value: string,
) => void;

export function composePluncAttributeValueSetter(
  formatPluncAttributeFn: PluncAttributeKeyFormatter,
) {
  return function setPluncAttributeValue(
    element: HTMLElement,
    key: string,
    value: string,
  ): void {
    const attributeKey = formatPluncAttributeFn(key);
    element.setAttribute(attributeKey, value);
  };
}

/**
 * Function type for getting an element by its component id within a certain context
 */
export type ElementSelectorByComponentId = (
  context: HTMLElement,
  componentId: ComponentId,
) => HTMLElement | null;

/**
 * Creates a function that retrieves an element by its component id
 * within a certain context.
 * @param selectElementFn
 * @param formatPluncAttributeFn
 */
export function createElementSelectorByComponentId(
  selectElementFn: typeof selectElement,
  formatPluncAttributeFn: PluncAttributeKeyFormatter,
) {
  return function (context: HTMLElement, componentId: ComponentId) {
    const attr = formatPluncAttributeFn("id");
    const selector = `[${attr}="${componentId}"]`;
    return selectElementFn(context, selector);
  };
}

/**
 * Function type for cleaning child components within a certain component element
 */
export type ChildComponentCleaner = (
  cElement: HTMLElement,
  childIds: Array<ComponentId>,
) => void;

/**
 * Creates a function that cleans child components within a certain component element.
 * @param elementSelectorByComponentIdFn - Function to get element by component id
 */
export function cleanChildComponents(
  selectElementByComponentId: ElementSelectorByComponentId,
) {
  return function (component: HTMLElement, childIds: Array<ComponentId>) {
    for (let i = 0; i < childIds.length; i++) {
      const childId = childIds[i];
      const child = selectElementByComponentId(component, childId);
      if (child !== null) child.innerHTML = "";
    }
  };
}

export function selectLiveAppRootElement(appName: string): HTMLElement {
  const appRootAttributeKey = `plunc-${GLOBAL_ATTR_FOR_APP_NAME}`;
  const selector = `[${appRootAttributeKey}="${appName}"]`;
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) {
    throw new Error(`Cannot find the app root element for app: ${appName}`);
  }
  return element;
}

/**
 * Creates and returns a staging HTML element.
 * This function utilizes the DOM implementation to create a new HTML document
 * and returns its body element, which can be used as a base element for further
 * manipulations or as a container.
 */
export type StagingElementCreator = (innerHtml?: string) => StagingHTMLElement;

export function makeStagingElement(innerHtml?: string): StagingHTMLElement {
  const element = document.implementation.createHTMLDocument().body;
  let isCommitted = false;
  if (innerHtml) {
    element.innerHTML = innerHtml;
  }
  function setInnerHtml(html: string) {
    if (isCommitted) {
      throw new Error(
        "Cannot set innerHTML after committing to target element.",
      );
    }
    element.innerHTML = html;
  }
  function getInnerHtml() {
    if (isCommitted) {
      throw new Error(
        "Cannot get innerHTML after committing to target element.",
      );
    }
    return element.innerHTML;
  }
  function getElement() {
    return element;
  }
  function commitTo(targetElement: HTMLElement) {
    if (isCommitted) {
      throw new Error("Staging element has already been committed.");
    }
    while (element.firstChild) {
      targetElement.appendChild(element.firstChild);
    }
    isCommitted = true;
  }
  return Object.freeze({
    setInnerHtml,
    getInnerHtml,
    commitTo,
    getElement,
  });
}
