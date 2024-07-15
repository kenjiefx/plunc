import { IF_ELEMENT_ATTR, XAttr } from "../helpers/attributes";
import { __disposeElement, __isElementLocked, __lockElement } from "../helpers/elements";
import { Component } from "../models/component";
import { PluncApp } from "../models/plunc";
import { Resolver } from "../models/resolver";

export const __conditionalRenders = (element: Element, component: Component, instance: PluncApp): Promise<void> => {
  return new Promise (async (resolve, reject) => {
    try {
      const attr = IF_ELEMENT_ATTR
      /** Retrieving all elements with ifs conditional */
      const nodes = XAttr.__getElementsByAttr(element, instance, attr)
      
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (!__isElementLocked(node, instance)) {
          const condition 
            = XAttr.__getValue(node, instance, attr)
          const scope = component.__getScope()
          if (scope === null || condition === null) continue
          const result = Resolver.__resolveExpression(scope, condition)
          if (typeof result ==='boolean' && !result) {
            __disposeElement(node, 'false')
          }
          __lockElement(node, instance)
        }
      }

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}