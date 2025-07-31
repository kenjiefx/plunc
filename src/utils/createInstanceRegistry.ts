import { ComponentId, ComponentInstance, ServiceInstance } from "../types";

export function createInstanceRegistry() {

  const registry: {[id: ComponentId]: ComponentInstance} | {[name:string]: ServiceInstance} = {}

  /**
   * Registers an instance in the registry.
   * @param id - The unique identifier for the instance.
   * @param object - The instance to register, which can be a ComponentInstance or ServiceInstance.
   */
  function registerInstance(id: ComponentId | string, object: ComponentInstance | ServiceInstance){
    registry[id] = object
  }

  /**
   * Retrieves an instance from the registry by its identifier.
   * @param id - The unique identifier for the instance.
   * @returns The registered instance if found, otherwise undefined.
   */
  function getInstance(id: ComponentId | string): ComponentInstance | ServiceInstance | undefined {
    return registry[id]
  }

  return {
    registerInstance,
    getInstance
  }

}