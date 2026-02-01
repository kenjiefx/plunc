import {
  ElementSelector,
  ElementsSelector,
} from "../contracts/element.interface";
import { PluncException } from "../errors/exception";
import { MissingLiveAppRootElementError } from "../errors/index";
import { ComponentId } from "../types";
import {
  GLOBAL_DIRECTIVE_FOR_APP_NAME,
  PluncAttributeKeyFormatter,
} from "./attributes";

export type ElementsSelectorWithPluncAttribute = (
  context: HTMLElement,
  pluncAttributeKey: string,
  pluncAttributeValue?: string,
) => Array<HTMLElement>;

export function composeElementSelectorsWithPluncAttribute(
  selectAllElementFn: ElementsSelector,
  formatPluncAttributeFn: PluncAttributeKeyFormatter,
) {
  return function selectAllElementsWithPluncAttribute(
    context: HTMLElement,
    pluncAttributeKey: string,
    pluncAttributeValue?: string,
  ): Array<HTMLElement> {
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
  selectElementFn: ElementSelector,
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
  const selector = `[${GLOBAL_DIRECTIVE_FOR_APP_NAME}="${appName}"]`;
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) {
    throw new PluncException<MissingLiveAppRootElementError>("ERR7");
  }
  return element;
}
