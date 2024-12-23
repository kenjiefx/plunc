import { HandlerFunction, FactoryHandlerFunction, HelperHandlerFunction } from "../interface";
import { Component } from "../models/component";
import { Lineage } from "../models/lineage";
import { PluncApp } from "../models/plunc";
import { Scope } from "../models/scope";
import { Service } from "../models/service";
import { SCOPE_ARGUMENT_KEY } from "./attributes";
import { __collectDependencies, __resolveDependencies } from "./dependency";

/**
 * Executes the handler/callback function of the component
 * @param component 
 * @param instance 
 * @param lineage 
 * @returns 
 */
export const __executeComponentHandler = (
  component: Component,
  instance: PluncApp,
  lineage: Lineage
): Promise<{[key: string]:any}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const name = component.__getName()
      const handler = instance.__library().__component(name)
      if (handler === null) {
        throw new Error(`missing component handler ${name}`)
      }

      const memoized = component.__getExposed()
      if (memoized !== null) {
        return resolve(memoized)
      }

      const dependencies = await __collectDependencies(handler)
      const injectables  = await __resolveDependencies({
        dependencies: dependencies,
        type: 'component',
        scope: component.__getScope(),
        instance: instance,
        lineage: lineage,
        component: component
      })

      const exposed = handler(...injectables)
      component.__setExposed(exposed)
      
      resolve(exposed)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Returns the name of the children of a component
 * @param component - Component
 * @param instance - PluncApp
 * @param lineage - Lineage
 */
export const __getNamesOfChildren = (
  component: Component,
  instance: PluncApp,
  lineage: Lineage
): Array<string> => {
  const childIds = lineage.children(component.__getId())
  const children = instance.__registry().__getByIds(childIds)
  return children.map(child => child.__getName())
}



export const __executeServiceHandler = (
  name: string, 
  instance: PluncApp
): Promise<Service> => {
  return new Promise (async (resolve, reject) => {
    try {
      let service = instance.__registry().__getById(name)
      if (service !== null) {
        return resolve(service)
      }
      const handler = instance.__library().__service(name)
      if (handler === null) {
        throw new Error(`missing service handler ${name}`)
      }
      const dependencies = await __collectDependencies(handler)
      const injectables 
        = await __resolveDependencies({
          dependencies: dependencies,
          type: 'service',
          instance: instance
        })
      service = handler(...injectables)
      if (service === undefined || service === null) {
        throw new Error(`service ${name} must not return ${typeof service}`)
      }
      instance.__registry().__register(name, service)

      resolve(service)

    } catch (error) {
      reject(error)
    }
  })
}


export const __executeFactoryHandler = (
  name: string, 
  instance: PluncApp
): Promise<(new (...args)=>any)> => {
  return new Promise( async (resolve,reject)=>{
    try {
      let handler = instance.__library().__factory(name)
      if (handler === null) {
        throw new Error(`missing factory handler ${name}`)
      }
      const dependencies = await __collectDependencies(handler)
      const injectables 
        = await __resolveDependencies({
          dependencies: dependencies,
          type: 'factory',
          instance: instance
        })
      const factory = handler(...injectables)
      if (typeof factory === 'function') {
        resolve(factory)
        return
      }
      throw new Error(`factory ${name} handler must return class reference`)
    } catch (error) {
      reject(error)
    }
  })
}



export const __executeHelperHandler = (
  component: Component,
  scope: Scope,
  name: string, 
  lineage: Lineage,
  instance: PluncApp
): Promise<{}> => {
  return new Promise(async (resolve, reject)=>{
    try {
      let handler = instance.__library().__helper(name)
      if (handler === null) {
        throw new Error(`missing helper handler ${name}`)
      }
      const dependencies = await __collectDependencies(handler)
      const injectables 
        = await __resolveDependencies({
          component: component,
          dependencies: dependencies,
          type: 'helper',
          scope: scope,
          instance: instance,
          lineage: lineage
        })
      const helper = handler(...injectables)
      resolve(helper)
    } catch (error) {
      reject(error)
    }
  })
}

export class TypeofFactory {}