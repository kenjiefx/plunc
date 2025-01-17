import { HandlerFunction, FactoryHandlerFunction, HelperHandlerFunction, PluncHandlers, ResolvedHandlers, ComponentId, BlockCallback } from "../interface"
import { Component } from "../models/component"
import { Lineage } from "../models/lineage"
import { PluncApp } from "../models/plunc"
import { Scope } from "../models/scope"
import { __applicationAPI } from "../api/app"
import { __blockAPI } from "../api/blocks"
import { __childrenRefService } from "../api/children"
import { __parentAPI } from "../api/parent"
import { __patchAPI } from "../api/patch"
import { APP_ARGUMENT_KEY, BLOCK_ARGUMENT_KEY, CHILDREN_ARGUMENT_KEY, COMPONENT_ARGUMENT_KEY, PARENT_ARGUMENT_KEY, PATCH_ARGUMENT_KEY, SCOPE_ARGUMENT_KEY } from "./attributes"
import { TypeofFactory, __executeComponentHandler, __executeFactoryHandler, __executeHelperHandler, __executeServiceHandler, __getNamesOfChildren } from "./handlers"
import { __componentAPI } from "../api/component"

/**
 * Resolves an array of dependencies. This function iterates
 * over existing components, services, factories, and
 * helpers in the library, and known argument keys,
 * matching them by the names.
 * @param param - @see DependencyResolverParams
 * @returns 
 */
export const __resolveDependencies = (
  params: DependencyResolverParams
): Promise<Array<ResolvedHandlers>> => {
  return new Promise(async (resolve,reject)=>{
    try {
      const injectables:Array<ResolvedHandlers> = []
      for (let i = 0; i < params.dependencies.length; i++) {
        const dependency = params.dependencies[i]

        if (dependency === SCOPE_ARGUMENT_KEY) {
          if (params.type === 'component' || params.type === 'helper') {
            injectables.push(params.scope)
            continue
          } 
          injectables.push(null)
          continue
        }

        if (dependency.charAt(0) === '$') {
          if (params.type === 'service' || params.type === 'factory') {
            injectables.push({})
            continue
          }
          switch (dependency) {
            case BLOCK_ARGUMENT_KEY:
              injectables.push((name: string, callback: BlockCallback<Element>)=>{
                return __blockAPI(params.component, params.instance, name, callback)
              })
              break;
            
            case PATCH_ARGUMENT_KEY:
              injectables.push((element: string | null = null)=>{
                return __patchAPI(params.component, params.instance, params.lineage, element)
              })
              break;

            case PARENT_ARGUMENT_KEY: 
              injectables.push(__parentAPI(params.component, params.lineage, params.instance))
              break;

            case APP_ARGUMENT_KEY: 
              injectables.push(__applicationAPI(params.instance))
              break; 

            case CHILDREN_ARGUMENT_KEY: 
              injectables.push(__childrenRefService())
              break;
            
            case COMPONENT_ARGUMENT_KEY: 
              injectables.push(__componentAPI(params.component, params.lineage, params.instance))
              break;

            default:
              injectables.push({})
              break;
          }
          continue
        }

        /**
         * We'll check if the dependency points to service by 
         * checking the library if the name exists
         */
        const service = params.instance.__library().__service(dependency)
        if (service !== null) {
          const injectable 
            = await __executeServiceHandler(dependency, params.instance)
          injectables.push(injectable)
          continue
        }

        /**
         * Next, we'll check if the dependency points to a factory
         */
        const factory = params.instance.__library().__factory(dependency)
        if (factory !== null) {
          const injectable 
            = await __executeFactoryHandler(dependency, params.instance)
          injectables.push(injectable)
          continue
        }

        /**
         * Next, we'll check if the dependency points to a helper
         */
        if (params.type === 'helper' || params.type === 'component'){
          const helper = params.instance.__library().__helper(dependency)
          if (helper !== null && params.scope !== null) {
            const injectable 
              = await __executeHelperHandler(
                params.component,
                params.scope, 
                dependency, 
                params.lineage, 
                params.instance
              )
            injectables.push(injectable)
            continue
          }
        }

        /**
         * Lastly, we'll check if the dependency points to a child component
         */
        if (params.type === 'component') {
          const children = params.lineage.children(params.component.__getId())
          .filter(childId => {
              const child = params.instance.__registry().__getById(childId) as Component
              return (child.__getName() === dependency)
          }).map(childId => {
            return params.instance.__registry().__getById(childId) as Component
          })
          if (children.length > 0) {
            const wrapper: {[id:ComponentId]: Component} = {}
            for (let i = 0; i < children.length; i++) {
              const child = children[i]
              await __executeComponentHandler(child, params.instance, params.lineage)
              wrapper[child.__getId()] = child
            }
            const proxy = __makeComponentProxy(wrapper)
            injectables.push(proxy)
            continue
          }

          /** 
           * Perhaps, it's an alias to a child component? 
           */
          const aliasChildren = params.lineage.children(params.component.__getId())
              .filter(childId => {
              const child = params.instance.__registry().__getById(childId) as Component
              return (child.__getAlias() === dependency);
          }).map(childId => {
              return params.instance.__registry().__getById(childId) as Component
          });
          if (aliasChildren.length > 0) {
            const wrapper: {[id:ComponentId]: Component} = {}
            for (let i = 0; i < aliasChildren.length; i++) {
              const child = aliasChildren[i]
              await __executeComponentHandler(child, params.instance, params.lineage)
              wrapper[child.__getId()] = child
            }
            const proxy = __makeComponentProxy(wrapper)
            injectables.push(proxy)
            continue
          }
        }

        /**
         * If all else fails to match, we'll push a `null` value, and throw 
         * a warning
         */
        injectables.push(null)
        console.warn(`plunc.js "${dependency}" not found`)

      }
      resolve(injectables)
    } catch (error) {
      reject(error)
    }
  })
}

export type DependencyResolverParams = {
  dependencies: Array<string>,
  type: 'component', 
  scope: Scope, 
  component: Component, 
  instance: PluncApp, 
  lineage: Lineage
} | {
  dependencies: Array<string>,
  type: 'service',
  instance: PluncApp, 
} | {
  dependencies: Array<string>,
  type: 'factory',
  instance: PluncApp,
} | {
  component: Component, 
  dependencies: Array<string>,
  type: 'helper', 
  scope: Scope, 
  instance: PluncApp, 
  lineage: Lineage
}


/**
 * Processes a function string and returns an array
 * of arguments or dependencies of the function.
 * @param handler - a typeof function
 * @returns 
 */
export const __collectDependencies = (
  handler: HandlerFunction<any,any> 
  | FactoryHandlerFunction<any> 
  | HelperHandlerFunction<any,any> 
): Promise<Array<string>> => {
  return new Promise (async (resolve,reject) => {
    try {
      const handlerStr = handler.toString().split('{')[0]
      if (handlerStr.charAt(0) !== '(') {
        const param = handlerStr.split('=>')[0]
        if (param === handlerStr) {
            resolve([])
            return 
        }
        resolve([param.trim()])
        return
      }
      const matchedFn  = handlerStr.match(/(?<=\().+?(?=\))/g)
      if (matchedFn===null || /[(={})]/g.test(matchedFn[0])) {
        return resolve([])
      }
      resolve(matchedFn[0].split(',').map(item => {
        return item.trim()
      }))
    } catch (error) {
      reject(error)
    }
  })
}

export const __makeComponentProxy = (
  wrapper: {[id:ComponentId]: Component}
): {[key:string]:any} => {
  const handler = {
    get: function get(target:{[id:ComponentId]: Component}, name: string){
      for (const id in target) {
        const component: Component = target[id]
        const exposed = component.__getExposed()
        if (exposed === null) {
          const name = component.__getName()
          throw new Error(`cannot invoke component`
            + ` "${name}}" before $app is ready`)
        }
        if (!(name in exposed)) {
          throw new Error(`calling undefined member "${name}" `
            + `in component "${component.__getName()}"`)
        }
        return exposed[name]
      }
    }
  }
  return new Proxy(wrapper,handler)
}

