import { MODEL_ELEMENT_ATTR, XAttr } from "../helpers/attributes";
import { HTML5Date, HTML5Time } from "../interface";
import { Component } from "../models/component"
import { PluncApp } from "../models/plunc"
import { Resolver } from "../models/resolver";
import { Scope } from "../models/scope";

/**
 * The HTML5 <input type="date"> element typically returns 
 * the date value as a string in the YYYY-MM-DD format. 
 * This behavior is part of the HTML5 specification, 
 * and most modern browsers adhere to this standard. 
 * @param date - supposedly date in YYYY-MM-DD format
 */
function __assertDateFormat(date: string): asserts date is HTML5Date {
  const message = `models assigned to Date input elements `
    + `must follow standard HTML5 format YYYY-MM-DD`
  const structure = date.split('-')
  const year = structure[0] ?? null
  if (year === null || year.length < 4) {
    throw new Error(message)
  }
  const month = structure[1] ?? null 
  if (month === null || parseInt(month) > 12) {
    throw new Error(month)
  }
  const day = structure[2] ?? null 
  if (day === null || parseInt(day) > 31) {
    throw new Error(day)
  }
}

/**
 * For the HTML5 <input type="time"> element, the standard format 
 * for the value returned is HH:MM, where HH is the hour in 
 * 24-hour format (00-23) and MM is the minutes (00-59). 
 * This format is specified by the HTML5 standard 
 * and is supported by most modern browsers.
 * @param time - supposedly date in HH:MM format
 */
function __assertTimeFormat(time: string): asserts time is HTML5Time {
  const message = `models assigned to Time input elements `
    + `must follow standard HTML5 format HH:MM`
  const structure = time.split(':')
  const hours = structure[0] ?? null 
  if (hours === null || hours.length < 2 || (parseInt(hours) > 23)) {
    throw new Error(message)
  }
  const minutes = structure[1] ?? null 
  if (minutes === null || minutes.length < 2 || parseInt(minutes) > 59) {
    throw new Error(message)
  }
}

const __assignModelValue = (
  scope: Scope,
  expression:string,
  value: number | string | boolean | {[key:string]:any} | (()=>unknown )
)=>{
  const parentObj = Resolver.__getParentObjAsObject(scope, expression)
  const childObjExpression = Resolver.__getChildObjectExp(expression);
  if (undefined !== parentObj) parentObj[childObjExpression] = value
}

const __assignModelState = (
  element: Element,
  state: boolean
)=>{
  (typeof state == 'boolean' && state) ?
    element.setAttribute('checked','') :
    element.removeAttribute('checked')
}

const __getCurrentDate = (): HTML5Date => {
  const date = new Date(Date.now())
  const nmonth = (date.getMonth() + 1 )
  const month = (nmonth < 10 ) ? `0${nmonth}` : nmonth
  const result = `${date.getFullYear()}-${month}-${date.getDate()}`
  __assertDateFormat(result)
  return result
}

const __getCurrentTime = (): HTML5Time => {
  const input = new Date(Date.now())
  const hours = (input.getHours() <10 ) ? `0${input.getHours()}` : input.getHours()
  const minutes = (input.getMinutes()<10) ? `0${input.getMinutes()}` : input.getMinutes()
  const result = hours+':'+minutes
  __assertTimeFormat(result)
  return result
}

export const __modelRenders = (
  element: Element, 
  component: Component, 
  instance: PluncApp
): Promise<void> => {
  return new Promise (async (resolve, reject) => {
    try {
      const attribute = MODEL_ELEMENT_ATTR
      const nodes = XAttr.__getElementsByAttr(element, instance, attribute)
      
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (node === null) continue

        const argument = XAttr.__getValue(node, instance, attribute)
        const scope = component.__getScope()
        if (scope === null || argument === null || argument.trim() === '') continue

        const evaluated = Resolver.__resolveExpression(scope, argument)
        let IsValueTypeOfString = true

        if (node.tagName === 'INPUT' || node.tagName === 'SELECT') {
          if ((node instanceof HTMLInputElement)) {
            const type = node.type

            /** Radio buttons and checkboxes */
            if (type ==='radio' || type === 'checkbox') {
              IsValueTypeOfString = false;
              (evaluated === undefined) ? 
                  __assignModelValue(scope, argument, false):
                  __assignModelState(node, evaluated)
            }

            /** Text inputs, but not textarea */
            if (type === 'text' || type === 'password' || type ===' email') {
              (evaluated===undefined) ?
                __assignModelValue(scope, argument, node.value) :
                node.value = evaluated
            }

            /**
             * Input type number value is always typeof string natively
             */
            if (type === 'number') {
              let value = evaluated
              if (evaluated === undefined) {
                value = '0'
              }
              __assignModelValue(scope, argument, value);
              node.value = value
            }

            /** Date input */
            if (type === 'date') {
              /** When evaluated is undefined, we will assign Date today */
              let inputDate = __getCurrentDate()
              if (evaluated !== undefined) {
                __assertDateFormat(evaluated)
                inputDate = evaluated
              } else {
                __assignModelValue(scope, argument, inputDate)
              }
              node.value = inputDate
            }

            /** Time input */
            if (type === 'time') {
              /** When evaluated is undefined, we will assign Date today */
              let inputTime = __getCurrentTime()
              if (evaluated !== undefined) {
                  __assertTimeFormat(evaluated)
                  inputTime = evaluated
              } else {
                  __assignModelValue(scope, argument, inputTime)
              }
              node.value = inputTime
            }

          }

          /** Select element */
          if ((node instanceof HTMLSelectElement)) {
            (evaluated===undefined) ?
              __assignModelValue(scope, argument, node.value ) :
                  node.value = evaluated
          }

          node.addEventListener('change', (event)=>{
            const target = event.target
            if (target instanceof HTMLInputElement){
              const value = (IsValueTypeOfString) ? target.value : target.checked
              __assignModelValue(scope, argument, value)
            }
            if (target instanceof HTMLSelectElement) {
              __assignModelValue(scope, argument, target.value)
          }
          })

        }
        
      }
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

