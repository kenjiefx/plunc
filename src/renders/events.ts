import { CLICK_EVENT_ATTR, CHANGE_EVENT_ATTR, TOUCH_EVENT_ATTR, XAttr } from "../helpers/attributes";
import { __isElementEventLocked, __lockElementEvent } from "../helpers/elements";
import { Component } from "../models/component"
import { PluncApp } from "../models/plunc"
import { Resolver } from "../models/resolver";
import { Scope } from "../models/scope";

/**
 * This function adds event listener to elements which is bound to a function
 * within the component scope
 */
const __bindEventToElement = (
  scope: Scope, 
  bindToElement: Element,
  fnExpression:string,
  eventType:string
) => {
  if (Resolver.__getResolveType(fnExpression) !== 'function' ) return
  bindToElement.addEventListener(eventType,()=>{
      Resolver.__resolveExpression(scope, fnExpression, bindToElement)
  })
}

export const __eventBinders = (
  element: Element, 
  component: Component, 
  instance: PluncApp
): Promise<void> => {
  return new Promise (async (resolve, reject) => {
    try {
      const events = [
        {type: 'click',  attr: CLICK_EVENT_ATTR},
        {type: 'change', attr: CHANGE_EVENT_ATTR},
        {type: 'keyup',  attr: TOUCH_EVENT_ATTR}
      ]
      for (let i = 0; i < events.length; i++) {
        const event = events[i]
        const nodes 
          = XAttr.__getElementsByAttr(element, instance, event.attr)
        for (let k = 0; k < nodes.length; k++) {
            const node = nodes[k]
            const fnExpression = XAttr.__getValue(node, instance, event.attr)
            
            if (__isElementEventLocked(node, event.type, instance)) continue 
            const scope = component.__getScope()
            if (scope===null || fnExpression==null ) continue
            __bindEventToElement(scope, node, fnExpression, event.type)
            __lockElementEvent(node, event.type, instance)
        }
      }
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}