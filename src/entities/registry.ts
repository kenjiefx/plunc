import { ComponentId } from "../types";
import { Component, IsComponent } from "./component";
import { Service } from "./service";

/**
 * A registry for of Components and Services.
 */
export type Registry = ReturnType<ReturnType<typeof createRegistryFactory>>;

export function createRegistryFactory(IsComponent: IsComponent) {
  return function createRegistry() {
    const data: Record<string, Component | Service> = {};

    function register(id: ComponentId | string, entity: Component | Service) {
      data[id] = entity;
    }

    function getByIds(ids: Array<ComponentId | string>) {
      const components: Component[] = [];
      for (const id of ids) {
        const entity = data[id];
        if (IsComponent(entity)) {
          components.push(entity);
        }
      }
      return components;
    }

    function getById(id: ComponentId | string): Component | Service | null {
      return data[id] ?? null;
    }

    function getAll() {
      return data;
    }

    return {
      register,
      getByIds,
      getById,
      getAll,
    };
  };
}
