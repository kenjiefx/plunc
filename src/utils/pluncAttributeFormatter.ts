import { PluncAttributeKeyFormatter } from "./pluncAttributeKeyFormatter"

/**
 * Type definition for a function that formats a plunc-related attribute.
 * @param attributeKey - The key of the attribute to format.
 * @param attributeValue - The value of the attribute to format.
 * @returns A formatted string representing the attribute.
 */
export type PluncAttributeFormatter = (
  attributeKey: string,
  attributeValue: string
) => string

/**
 * Creates a plunc-related attribute with a specified key and value.
 * @param createPluncAttributeKeyFn - A function that creates a prefixed attribute key.
 * @returns 
 */
export function createPluncAttributeFormatter(
  pluncAttributeKeyFormatter: PluncAttributeKeyFormatter
) {
  return function (
    attributeKey: string,
    attributeValue: string
  ): string {
    const prefixedKey = pluncAttributeKeyFormatter(attributeKey)
    return `${prefixedKey}="${attributeValue}"`
  }
}