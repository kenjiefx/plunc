import { PluncAttributeKeyFormatter } from "./pluncAttributeKeyFormatter"

export type ElementGetter = (element: Element) => (attributeName: string) => NodeListOf<Element>

export function createElementGetterByPluncAttribute(
  pluncAttributeKeyFormatter: PluncAttributeKeyFormatter
) {
  return function (element: Element) {
    return function (attributeName: string) {
      const pluncAttr = pluncAttributeKeyFormatter(attributeName)
      return element.querySelectorAll(`[${pluncAttr}]`)
    }
  }
}