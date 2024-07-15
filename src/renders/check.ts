import { CHECK_ELEMENT_ATTR, XAttr } from "../helpers/attributes"
import { __isElementLocked, __lockElement } from "../helpers/elements"
import { Component } from "../models/component"
import { PluncApp } from "../models/plunc"
import { Resolver } from "../models/resolver"

export const __checkRenders = (
  element: Element, 
  component: Component, 
  instance: PluncApp
): Promise<void> => {
  return new Promise (async (resolve, reject) => {
    try {
      const attribute = CHECK_ELEMENT_ATTR
      const nodes 
        = XAttr.__getElementsByAttr(element, instance, attribute)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (__isElementLocked(node, instance)) continue
        const argument = XAttr.__getValue(node, instance, attribute)
        const scope = component.__getScope()
        if (scope === null || argument === null || argument.trim() === '') continue
        const evaluated = Resolver.__resolveExpression(scope, argument)
        if (typeof evaluated === 'boolean') {
          evaluated ? node.setAttribute('checked','') : node.removeAttribute('checked')
        }
        __lockElement(node, instance)
      }
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}