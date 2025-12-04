import { ComponentId, PluncAppConfiguration } from "../types";
import { COMPONENT_ELEMENT_ATTR } from "./pluncAttribute";

/**
 * Selects an element within the given context using the provided CSS selector.
 * @param context - HTMLElement to search within
 * @param selector - CSS selector string to match the element
 * @returns The first matching HTMLElement or null if no match is found
 */
export function selectElement(
  context: HTMLElement,
  selector: string
): HTMLElement | null {
  return context.querySelector<HTMLElement>(selector);
}

/**
 * Selects all elements within the given context that match the provided selector.
 * @param context
 * @param selector
 * @returns
 */
export function selectAllElements(
  context: HTMLElement,
  selector: string
): HTMLElement[] {
  return Array.from(context.querySelectorAll<HTMLElement>(selector));
}

/**
 * Selects all elements within the given context that have the specified attribute.
 * @param context
 * @param attribute
 * @returns
 */
export function selectAllElementsByAttribute(
  context: HTMLElement,
  attribute: string
): HTMLElement[] {
  return Array.from(context.querySelectorAll<HTMLElement>(`[${attribute}]`));
}

/**
 * Selects an element with a certain component ID attribute.
 * @param context
 * @param componentId
 * @param configuration
 * @returns
 */
export function selectElementWithComponentId(
  context: HTMLElement,
  componentId: ComponentId,
  configuration: PluncAppConfiguration
): HTMLElement | null {
  const prefix = configuration.prefix ?? "plunc-";
  const attributeWithValue = `${prefix}id="${componentId}"`;
  return context.querySelector<HTMLElement>(`[${attributeWithValue}]`);
}

/**
 * Gets the first-level children of a parent element that have a specific attribute.
 * @param parent - The parent HTMLElement to search within
 * @param attribute - The attribute name to look for in child elements
 * @returns
 */
export function getFirstChildrenWithAttribute(
  parent: HTMLElement,
  attribute: string
) {
  const selectedChildren = parent.querySelectorAll<HTMLElement>(
    `[${attribute}]`
  );
  const results: HTMLElement[] = [];
  selectedChildren.forEach((element) => {
    if (element.parentElement === null) {
      results.push(element);
      return;
    }
    const closestAncestorWithAttribute = element.parentElement.closest(
      `[${attribute}]`
    );
    if (closestAncestorWithAttribute === null) {
      results.push(element);
    }
  });
  return results;
}
