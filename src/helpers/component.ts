import { ComponentId } from "../interface";
import { Component } from "../models/component";
import { Lineage } from "../models/lineage";
import { PluncApp } from "../models/plunc";
import { BLOCK_ELEMENT_ATTR, COMPONENT_ELEMENT_ATTR, ELEMENT_REFERENCE_ATTR, XAttr } from "./attributes";
import { __getTempl } from "./templates";

export const __makeComponentId = (instance: PluncApp, id: number, existing: string = ''): ComponentId => {
  if (existing !== '') {
    return `${existing}.${id.toString()}` as ComponentId
  }
  return `${instance.__getId().toString()}.${id.toString()}` as ComponentId
}

export const __buildComponent = (
  id: ComponentId,
  component: Element,
  instance: PluncApp,
  lineage: Lineage
): Promise<string> => {
  return new Promise (async (resolve, reject) => {
    try {

      /** First, we'll check if component has declared template */
      const name = XAttr.__getValue(component, instance, COMPONENT_ELEMENT_ATTR)
      if (name === null) return resolve('')

      /** Get component template */
      const cTempl = __getTempl(instance, name)

      /** Component implementation element */
      const implementation = document.implementation.createHTMLDocument()
      implementation.body.innerHTML = cTempl

      __attachRefIdToNamedElements(id, implementation, instance)

      await __buildChildren(
        id, implementation, instance, lineage
      )

      resolve(implementation.body.innerHTML)

    } catch (error) {
      reject(error)
    }
  })
}

export const __attachRefIdToNamedElements = (
  id: ComponentId,
  implementation: Document,
  instance: PluncApp
) => {
  const refAttr = XAttr.__create(ELEMENT_REFERENCE_ATTR, instance)
  const attrList = [BLOCK_ELEMENT_ATTR]
  const allElements: Array<Element> = []
  /** Retrieving all elements with plunc-block */
  attrList.forEach(attr => {
    const elements = Array.from(
      implementation.body.querySelectorAll(
        `[${XAttr.__create(attr, instance)}]`
      )
    )
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      const name = XAttr.__getValue(element, instance, attr)
      __assertNamedElementFormat(name)
    }
    allElements.push(...elements)
  })
  /** For each named elements, we'll add reference ids */
  allElements.forEach(element => {
    element.setAttribute(refAttr, id)
  })
}

export const __assertNamedElementFormat = (name: unknown) => {
  const message = `named element name must not be empty or `
    + `contain invalid characters`
  if (name === null) {
    throw new Error(message)
  }
  if (!(typeof name === 'string')) {
    throw new Error(message)
  }
  if (name.includes("\\")) {
    throw new Error(message)
  }
}

const __buildChildren = async (
  parentId: ComponentId,
  parent: Document,
  instance: PluncApp,
  lineage: Lineage
): Promise<void> => {
  return new Promise(async (resolve, reject)=>{
    let  compiled = ''
    const cattr    = COMPONENT_ELEMENT_ATTR
    const selector = XAttr.__create(cattr, instance)
    const children = parent.querySelectorAll(`[${selector}]`)

    for (let i = 0; i < children.length; i++) {
      const child = children[i]

      /** Child components must have names */
      const name = XAttr.__getValue(child, instance, cattr)
      if (name === null) continue 
      
      /** Setting ids to child components */
      const childId = __makeComponentId(instance, i, parentId)
      child.setAttribute(
        XAttr.__create('id', instance),
        childId
      )
      lineage.begat(parentId, childId)

      /** Creates the Child component object if not existing */
      let childObj: Component 
      const existing = instance.__registry().__getById(childId)
      if (existing !== null && existing instanceof Component) {
        childObj = existing
      } else {
        childObj = new Component(childId, name)
      }

      __hasCircularDependency(lineage, childObj, instance)

      instance.__registry().__register(childId, childObj)
      child.innerHTML = await __buildComponent(
        childId,
        child,
        instance,
        lineage
      )
    }

    resolve()
    
  })
}

/**
 * A step that checks whether the child component
 * is its own parent or grand parent.
 * @param lineage Lineage object 
 * @param component Component object
 * @param instance PluncApp instance
 */
const __hasCircularDependency = (
  lineage: Lineage,
  component: Component,
  instance: PluncApp
) => {
  const name = component.__getName()
  const idsOfParents = lineage.lookup(
    component.__getId()
  )
  const parents = instance.__registry().__getByIds(idsOfParents)
  parents.forEach(parentC => {
    if (parentC.__getName() === name) {
      throw new Error(`plunc.js circular dependency of component
        "${name}" detected in registry`)
    }
  })
}