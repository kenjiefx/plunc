import { PluncAttributeKeyFormatter } from "../contracts/attributes";
import {
  ElementSelector,
  ElementSelectorByComponentId,
  ElementsSelector,
} from "../contracts/elements";
import { ComponentId, PluncAttributeKey, StagingHTMLElement } from "../types";
import { GLOBAL_DIRECTIVE_FOR_APP_NAME } from "./pluncAttribute";

export function selectElement(
  context: HTMLElement,
  selector: string,
): HTMLElement | null {
  return context.querySelector<HTMLElement>(selector);
}

export function selectAllElements(
  context: HTMLElement,
  selector: string,
): HTMLElement[] {
  return Array.from(context.querySelectorAll<HTMLElement>(selector));
}

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
 * Creates a function that cleans child components within a certain component element.
 * @param elementSelectorByComponentIdFn - Function to get element by component id
 */
export function composeChildComponentCleaner(
  selectElementByComponentId: ElementSelectorByComponentId,
) {
  return function cleanChildComponent(
    component: HTMLElement,
    childIds: Array<ComponentId>,
  ) {
    for (let i = 0; i < childIds.length; i++) {
      const childId = childIds[i];
      const child = selectElementByComponentId(component, childId);
      if (child !== null) child.innerHTML = "";
    }
  };
}

export function selectLiveAppRootElement(appName: string): HTMLElement {
  const appRootAttributeKey = `${GLOBAL_DIRECTIVE_FOR_APP_NAME}`;
  const selector = `[${appRootAttributeKey}="${appName}"]`;
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) {
    throw new Error(`Cannot find the app root element for app: ${appName}`);
  }
  return element;
}
