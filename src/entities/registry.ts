import { ComponentId } from "../types";
import { ComponentObject } from "./component";
import { ServiceObject } from "./service";

/**
 * A registry for of Component and Service objects
 */
export type Registry = {
  data: Record<string, ComponentObject | ServiceObject>;
};

/**
 * Creates a new empty registry
 * @returns
 */
export function createRegistry(): Registry {
  return {
    data: {},
  };
}

/**
 * Adds a Component or Service object to the registry
 * @param registry
 * @param id
 * @param entity
 */
export function addToRegistry(
  registry: Registry,
  id: ComponentId | string,
  entity: ComponentObject | ServiceObject,
) {
  registry.data[id] = entity;
}

/**
 * Retrieves Component and Service objects from the registry by their ids
 * @param registry
 * @param ids
 * @returns
 */
export function getFromRegistryByIds(
  registry: Registry,
  ids: Array<ComponentId | string>,
) {
  return ids
    .map((id) => registry.data[id])
    .filter((entity) => entity !== undefined);
}

/**
 * Retrieves a Component or Service object from the registry by its id
 * @param registry
 * @param id
 * @returns
 */
export function getFromRegistryById(
  registry: Registry,
  id: ComponentId | string,
): ComponentObject | ServiceObject | null {
  return registry.data[id] ?? null;
}

/**
 * Retrieves all Component and Service objects from the registry
 * @param registry
 * @returns
 */
export function getAllFromRegistry(
  registry: Registry,
): Record<string, ComponentObject | ServiceObject> {
  return registry.data;
}
