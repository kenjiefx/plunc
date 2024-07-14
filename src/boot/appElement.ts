
import { APP_ATTR, XAttr } from "../helpers/attributes";
import { PluncApp } from "../models/plunc";

/**
 * Returns the element within the DOM body with the attribute
 * `plunc-app`, or depending of what prefix being used
 */
export const __getXAppElement = (instance: PluncApp): Element => {
  const name = `${instance.__getName()}`
  const selector = `
    [${XAttr.__createWithValue(APP_ATTR, instance, name)}]
  `
  const elements = document.querySelectorAll(`${selector.trim()}`)
  if (elements.length === 0) throw new Error('100')
  if (elements.length > 1) throw new Error('101')
  return elements[0]
}