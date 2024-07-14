import { REPEAT_ELEMENT_ATTR, REPEAT_REFERENCE_TOKEN, XAttr } from "../helpers/attributes"
import { __copyBindElement, __makeTempElement } from "../helpers/elements"
import { ComponentId } from "../interface"
import { Component } from "../models/component"
import { PluncApp } from "../models/plunc"
import { Resolver } from "../models/resolver"
import { Scope } from "../models/scope"
import { __renderHelper } from "./index"

/**
 * Dissects repeat expression into two parts, refObjName and aliasObjName. 
 * For example, `users as user` will be dissected
 * into `['users', 'user']`. Similarly, `item until 3`
 * will be dissected into `['item', 3]`
 * @param expression 
 * @returns 
 */
const __dissectRepeatExpr = (expression: string): Array<string> => {
  if (expression.includes('until ')) {
    return [
      REPEAT_REFERENCE_TOKEN,
      expression.split('until')[1].trim()
    ]
  }
  return [
    expression.split(' as ')[0].trim(),
    expression.split(' as ')[1].trim()
  ]
}

const __howManyRepeatitions = (repetitions: unknown): number => {
  if (repetitions instanceof Array) return repetitions.length
  if (typeof repetitions === 'number' && Number.isInteger(repetitions)) return repetitions
  throw new Error(`repeatable elements must have repeatable values`)
}

/**
 * This function simply checks if a value is iterable 
 * with `Object.entries`.
 * @param value
 */
const __isIterableWithEntries = (value: unknown): boolean => {
  return value !== null && (typeof value === 'object' || Array.isArray(value))
}

export const __repeatRenders = (
  element: Element, 
  component: Component, 
  instance: PluncApp
): Promise<void> => {
  return new Promise (async (resolve, reject) => {
    try {
      
      /** Retrieving all repeatable elements */
      const repeatables 
        = XAttr.__getElementsByAttr(element, instance, REPEAT_ELEMENT_ATTR)

      const scope = component.__getScope()
      if (scope === null) return resolve()

      for (let i = 0; i < repeatables.length; i++) {
        const repeatable = repeatables[i]
        const template = repeatable.innerHTML
        repeatable.innerHTML = ''

        let expression 
          = XAttr.__getValue(repeatable, instance, REPEAT_ELEMENT_ATTR)

        if (expression === null || expression.trim() === '') continue 

        let [refObjName, aliasObjName] = __dissectRepeatExpr(expression)

        if (refObjName === REPEAT_REFERENCE_TOKEN) {
          /** This creates a new object that we can loop through **/
          let repetitions = Resolver.__resolveExpression(scope, aliasObjName)
          /** How many repitions to be made */
          let times = __howManyRepeatitions(repetitions)
          scope['$$index'] = {}
          let k = 0
          while (k < times) scope['$$index']['props'+(k++)] = new Object
        }

        const repeatableObj = Resolver.__resolveExpression(scope, refObjName)
        
        if (__isIterableWithEntries(repeatableObj)) {
          let indexNumber = 0
          for (const [key, value] of Object.entries(repeatableObj)) {

            /** Creating an invidual component for each repititions **/
            const id = 'any' as ComponentId
            let dummy = new Component(id,'any')
            dummy.__importScope({
              $parent: scope,
              $index: indexNumber++,
              [aliasObjName]: repeatableObj[key]
            })
            const child = __makeTempElement()
            child.innerHTML = template
            await __renderHelper(child, dummy, instance, true)
            __copyBindElement(child, repeatable)
          }
        }
      }

      resolve()

    } catch (error) {
      reject(error)
    }
  })
}