import { __getXAppElement } from "../boot/appElement"
import { BLOCK_ELEMENT_ATTR, XAttr } from "../helpers/attributes"
import { __buildComponent } from "../helpers/component"
import { __makeTempElement, __scopeBindElement, __selectElementsButNotChildOfComponent } from "../helpers/elements"
import { __getBlockTempl } from "../helpers/templates"
import { Component } from "../models/component"
import { Lineage } from "../models/lineage"
import { PluncApp } from "../models/plunc"
import { __renderHelper } from "../renders/index"

export const __patchAPI = (
  component: Component,
  instance: PluncApp,
  lineage: Lineage,
  block: string | null = null
): Promise<void> => {
  return new Promise (async (resolve, reject) => {
    try {
      if (!instance.__isReady()) {
        throw new Error(`cannot use $patch outside $app.ready`)
      }
      let mode: 'component' | 'block' = 'component'
      let patchableNodes = [XAttr.__getElementByCId(
        __getXAppElement(instance),
        instance,
        component.__getId()
      )]
      if (block !== null) {
        mode = 'block'
        const elementsButNotChild = __selectElementsButNotChildOfComponent(
          XAttr.__createWithValue(BLOCK_ELEMENT_ATTR,instance,block),
          component,
          lineage,
          instance
        )
        if (elementsButNotChild===null) {
            return 
        }
        patchableNodes = Array.from(elementsButNotChild)
      }

      if (patchableNodes.length === 0 || patchableNodes[0] === null) {
        return resolve()
      }

      for (let i = 0; i < patchableNodes.length; i++) {
        const elementBindTo = patchableNodes[i]
        if (elementBindTo === null) continue
        let elementBindFrom = __makeTempElement() 
        if (mode==='component') {
          elementBindFrom.innerHTML = await __buildComponent(
            component.__getId(), 
            elementBindTo, 
            instance, 
            lineage
          )
        } else {
            if (block === null) continue
            const template 
              = __getBlockTempl(instance, component.__getName(), block)
            if (template===null) continue
            elementBindFrom.innerHTML = template
        }
        await __renderHelper(elementBindFrom, component, instance)
        if (elementBindTo===null) continue
        const childIds = lineage.children(component.__getId())
        __scopeBindElement(
          elementBindFrom,
          elementBindTo,
          instance,
          childIds
        )

        /**
         * Find all unrendered child component. This happens usually because of 
         * conditional statements such xif 
         */
        for (let k = 0; k < childIds.length; k++) {
          const childId = childIds[k]
          const childComponent 
            = XAttr.__getElementByCId(elementBindTo, instance, childId)
          if (childComponent === null) continue
          if (childComponent.innerHTML.trim() === '') {
            await __renderPatchableChildComponent(
                childComponent,
                instance.__registry().__getById(component.__getId()) as Component,
                lineage,
                instance
            )
          }
        }

      }

      resolve()

    } catch (error) {
      console.error(`plunc.js $patch error: ${error.message}`)
      reject(error)
    }
  })
}


const __renderPatchableChildComponent = (
  elementToBindTo: Element,
  component: Component,
  lineage: Lineage,
  instance:PluncApp
):Promise<void> => {
  return new Promise (async (resolve, reject) => {
    try {
      const elementBindFrom = __makeTempElement()
      elementBindFrom.innerHTML = await __buildComponent(
        component.__getId(), 
        elementToBindTo, 
        instance, 
        lineage
      )
      await __renderHelper(elementBindFrom, component, instance)
      const childIds = lineage.children(component.__getId())
      for (let i = 0; i < childIds.length; i++) {
        const childId = childIds[i]
        const childComponent = XAttr.__getElementByCId(
            elementBindFrom,
            instance,
            childId
        )
        if (childComponent !==null ) {
            await __renderPatchableChildComponent (
                childComponent,
                instance.__registry().__getById(childId) as Component,
                lineage,
                instance
            )
        }
      }
      __scopeBindElement(
        elementBindFrom,
        elementToBindTo,
        instance,
        childIds
      )
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

