import { PluncElement } from "../models/pluncElement"

/**
 * Creates a `PluncElement` from a DOM element, wrapping it and its parent elements up to a specified depth.
 * @param element - The DOM element to wrap.
 * @param maxDepth - The maximum depth of parent elements to wrap. Defaults to 3.
 * @returns - A `PluncElement` instance representing the provided element and its parent hierarchy.
 */
export function createPluncElement(element: Element, maxDepth = 3) {
  let parent: PluncElement | undefined = undefined
  let current = element.parentElement
  let depth = 0
  while (current && depth < maxDepth) {
    parent = new PluncElement(current, parent)
    current = current.parentElement
    depth++
  }
  return new PluncElement(element, parent)
}