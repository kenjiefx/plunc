import { PluncAttributeKeyFormatter } from "./pluncAttributeKeyFormatter"

/**
 * Type definition for a function that retrieves the value of a plunc-related attribute.
 * @param element - The HTML element from which to retrieve the attribute value.
 * @param key - The key of the attribute to retrieve.
 * @returns The value of the attribute or null if it does not exist.
 */
export type PluncAttributeValueGetter = (
  element: Element,
  key: string
) => string | null

/**
 * Retrieves the value of a plunc-related attribute from an element.
 * @param createPluncAttributeKeyFn - A function that creates a prefixed attribute key.
 * @returns A function that takes an element and a key, returning the attribute value or null if not found.
 */
export function createPluncAttributeValueGetter(
  pluncAttributeKeyFormatter: PluncAttributeKeyFormatter
) {
  return function (element: Element, key: string): string | null {
    const prefixedKey = pluncAttributeKeyFormatter(key)
    return element.getAttribute(prefixedKey)
  }
}