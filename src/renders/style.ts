import { STYLE_ELEMENT_ATTR, XAttr } from "../helpers/attributes"
import { __isElementLocked, __lockElement } from "../helpers/elements"
import { Component } from "../models/component"
import { PluncApp } from "../models/plunc"
import { Resolver } from "../models/resolver"

/**
 * Collects all elements with the `plunc-style` attribute and evaluates the
 * expression provided as the attribute's value. The resulting string is
 * then added to the class list of each element.
 * 
 * @example
 * `$scope.printClassNames = () => 'font-3'`
 * `<div plunc-style="printClassNames()">Hello world</div>`
 * 
 * will result to: 
 * `<div plunc-style="printClassNames()" class="font-3">Hello world</div>`
 * 
 * @param element 
 * @param component 
 * @param instance
 */
export const __styleRenders = (
  element: Element, 
  component: Component, 
  instance: PluncApp
): Promise<void> => {
  return new Promise (async (resolve, reject) => {
    try {
      const attribute = STYLE_ELEMENT_ATTR
      const nodes = XAttr.__getElementsByAttr(element, instance, attribute)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (__isElementLocked(node, instance)) continue
        const argument = XAttr.__getValue(node, instance, attribute)
        const scope = component.__getScope()
        if (scope === null || argument === null || argument.trim() === '') continue
        const evaluated = Resolver.__resolveExpression(scope, argument)
        if (evaluated !== null && evaluated !=='' && evaluated !== undefined) {
          node.classList.add(evaluated)
        }
        __lockElement(node, instance)
      }
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}