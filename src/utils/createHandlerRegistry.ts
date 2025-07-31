import {
  FactoryHandlerFunction,
  HandlerFunction,
  HelperHandlerFunction,
  PluncHandlers,
} from "../types"

// Map each handler type to its appropriate function type
type HandlerTypeMap = {
  component: HandlerFunction<any, any>
  service: HandlerFunction<any, any>
  factory: FactoryHandlerFunction<any>
  helper: HelperHandlerFunction<any, any>
}

export function createHandlerRegistry() {

  const registry: {
    [key:string]: HandlerFunction<any,any> 
    | FactoryHandlerFunction<any> 
    | HelperHandlerFunction<any,any> 
  } = {}

  /**
   * Creates handler key by its name and type.
   * @param name - The name of the handler
   * @param type - The type of the handler (component, service, factory, or helper)
   */
  function createKey<T extends PluncHandlers>(type: T, name: string): string {
    return `${type}.${name}`
  }

  /**
   * Registers a handler for a component, service, factory, or helper.
   * @param name 
   * @param type 
   * @param handler 
   */
  function registerHandler<T extends PluncHandlers>(
    name: string,
    type: T,
    handler: HandlerTypeMap[T]
  ): void {
    const key = createKey(type, name)
    registry[key] = handler
  }

  /**
   * Retrieves a handler by its type and name. 
   * @param type 
   * @param name 
   * @returns 
   */
  function getHandler<T extends PluncHandlers>(
    type: T,
    name: string
  ): HandlerTypeMap[T] | null {
    const key = createKey(type, name)
    return (registry[key] ?? null) as HandlerTypeMap[T] | null
  }

  return {
    registerHandler,
    getHandler,
  }
}
