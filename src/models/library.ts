import { FactoryHandlerFunction, HandlerFunction, HelperHandlerFunction, PluncHandlers } from "../interface";

/**
 * A dictionary of handlers of components, services,
 * factories, and helpers.
 */
export class Library {
  handlers: {
    [key:string]: HandlerFunction<any,any> 
    | FactoryHandlerFunction<any> 
    | HelperHandlerFunction<any,any> 
  }
  constructor(){
    this.handlers = {}
  }
  __register(
    name: string,
    type: PluncHandlers,
    handler: HandlerFunction<any,any> 
      | FactoryHandlerFunction<any> 
      | HelperHandlerFunction<any,any>
  ): void {
    const namespace = this.__namespace(type, name)
    this.handlers[namespace] = handler
  }
  __namespace(
    type: PluncHandlers,
    name: string
  ){
    return `${type}.${name}`
  }
  __component(name:string): HandlerFunction<any,any> {
    const namespace 
      = this.__namespace('component', name)
    return this.handlers[namespace] as HandlerFunction<any,any>
  }
  __service(name: string): HandlerFunction<any,any> | null {
    const namespace 
      = this.__namespace('service', name)
    return (this.handlers[namespace] ?? null) as HandlerFunction<any,any> | null
  }
  __factory(name: string): FactoryHandlerFunction<any> | null {
    const namespace 
      = this.__namespace('factory', name)
    return (this.handlers[namespace] ?? null) as FactoryHandlerFunction<any> | null
  }
  __helper(name: string): HelperHandlerFunction<any,any> | null {
    const namespace 
      = this.__namespace('helper', name)
    return (this.handlers[namespace] ?? null) as HelperHandlerFunction<any,any> | null
  }
}