import { PLUNC_ID_ATTRIBUTE } from "./attributesList";
import { PluncAttributeFormatter } from "./pluncAttributeFormatter";

/**
 * A function that retrieves a component element by its ID from a given element.
 * @param element - The parent element to search within.
 * @returns A function that takes a component ID and returns the corresponding element or null if not found.
 */
export type ComponentElementGetter = (element: Element) => (componentId: string) => Element | null

/**
 * Creates a function to retrieve a component element by its ID from a given element.
 * @param pluncAttributeFormatter - A function that formats the attribute key and value.
 * @returns A function that takes an element and returns another function to get the component element by ID.
 */
export function createComponentElementGetter(
  pluncAttributeFormatter: PluncAttributeFormatter
) {
  return function (element: Element) {
    return function (componentId: string): Element | null {
      const attributeString = pluncAttributeFormatter(PLUNC_ID_ATTRIBUTE, componentId)
      const attrSelector = `[${attributeString}"]`
      return element.querySelector(attrSelector)
    }
  }
}