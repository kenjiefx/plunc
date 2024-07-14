import { __getXAppElement } from "../boot/appElement";
import { ComponentId } from "../interface";
import { Component } from "../models/component";
import { Lineage } from "../models/lineage";
import { PluncApp } from "../models/plunc";
import { EVENT_ELEMENT_ATTR, LOCK_ID_ATTR_KEY, LOCK_ID_ATTR_VALUE, STRAWBERRY_ID_ATTR, XAttr } from "./attributes";

export const __clearChildComponents = (
  cElement: Element, 
  childIds: Array<ComponentId>,
  instance: PluncApp
) => {
  for (let i = 0; i < childIds.length; i++) {
    const childId = childIds[i]
    const childEl 
      = XAttr.__getElementByCId(cElement, instance, childId)
    if (childEl !== null) childEl.innerHTML = ''
  }
}

export const __makeTempElement = () => {
  return document.implementation.createHTMLDocument().body
}

export const __copyBindElement = (
  bindFrom: Element,
  bindTo: Element
) => {
  if (bindFrom===null) return 
  while (bindFrom.childNodes.length > 0) {
      bindTo.appendChild(bindFrom.childNodes[0])
  }
}

export const __lockElement = (element: Element, instance: PluncApp) => {
  const attr = XAttr.__create(LOCK_ID_ATTR_KEY, instance)
  element.setAttribute(attr, LOCK_ID_ATTR_VALUE)
}

export const __isElementLocked = (element: Element, instance: PluncApp) => {
  const attr = XAttr.__create(LOCK_ID_ATTR_KEY, instance)
  return (element.getAttribute(attr) !== null)
}

export const __disposeElement = (element: Element, comment: string) => {
  if (null!==element) {
      element.innerHTML = '';
      if (element.parentNode !== null) {
          element.outerHTML  = '<!-- plunc.js: '+element.outerHTML+' | '+comment+' -->';
      }
  }
}

export const __scopeBindElement = (
  bindFromEl: Element,
  bindToEl: Element,
  instance: PluncApp,
  childIds: Array<ComponentId>
) => {
  const tempChildRegistry = {}
  for (let i = 0; i < childIds.length; i++) {
    const childId     = childIds[i]
    const tempChildEl = __makeTempElement()
    const actualChildEl  
      = XAttr.__getElementByCId(bindToEl, instance, childId)
    if (actualChildEl !== null) {
      __copyBindElement(
        actualChildEl,
        tempChildEl
      )
      tempChildRegistry[childId] = tempChildEl
    }
  }
  bindToEl.innerHTML = ''
  __copyBindElement(
    bindFromEl,
    bindToEl
  )
  for (const childId in tempChildRegistry) {
    const actualChildEl 
      = XAttr.__getElementByCId(bindToEl, instance, childId as ComponentId)
    if (actualChildEl === null) continue
    __copyBindElement(
      tempChildRegistry[childId],
      actualChildEl
    )
  }

}


export const __isElementEventLocked = (
  element: Element,
  eventName: string,
  instance: PluncApp
) => {
  const attribute = XAttr.__create(EVENT_ELEMENT_ATTR, instance)
  let result = false
  const existing = element.getAttribute(attribute)
  if (existing === null) return false
  const events = existing.split(',')
  for (let i = 0; i < events.length; i++) {
    if (eventName === events[i]) {
        result = true
    }
  }
  return result
}

export const __lockElementEvent = (
  element: Element,
  eventName: string, 
  instance: PluncApp
) => {
  const attribute = XAttr.__create(EVENT_ELEMENT_ATTR, instance)
  const existing = element.getAttribute(attribute)
  if (existing === null) {
      element.setAttribute(attribute, eventName)
      return
  }
  let events = existing.split(',')
  for (var i = 0; i < events.length; i++) {
    if (eventName !== events[i]) {
      events.push(eventName)
    }
  }
  element.setAttribute(attribute, events.join(','))
}

export const __selectElementsButNotChildOfComponent = (
  attrWithValue: string,
  component: Component,
  lineage: Lineage,
  instance: PluncApp
): NodeListOf<Element> | null => {
  const childIds = lineage.children(component.__getId())
  let selector = ''
  for (let i = 0; i < childIds.length; i++) {
      const childId = childIds[i]
      const childAttrName = XAttr.__createWithValue(
          STRAWBERRY_ID_ATTR,
          instance,
          childId
      )
      selector += ':not(['+childAttrName+'])'
  }
  selector += ` > [${attrWithValue}]`

  if (childIds.length === 0) {
      const xidAttrName = XAttr.__createWithValue(
        STRAWBERRY_ID_ATTR, instance, 
        component.__getId()
      )
      selector = `[${xidAttrName}] [${attrWithValue}]`
  }
  const componentElement = XAttr.__getElementByCId(
      __getXAppElement(instance),
      instance,
      component.__getId()
  )
  if (componentElement===null) return null
  return componentElement.querySelectorAll(selector)
}
