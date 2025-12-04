import { ComponentId, ComponentScope } from "../types";
import { parseAliasNotation } from "../utils/aliasNotation";
import { createScope } from "./scope";

/**
 * Represents a component (functional version).
 */
export type ComponentObject = {
  id: ComponentId;
  name: string;
  alias: string | null;
  scope: ComponentScope;
};

/**
 * Composes a factory function for creating components.
 * @param parseAliasNotation
 * @param createScope
 * @returns
 */
export function createComponentFactory(
  parseAliasNotationFn: typeof parseAliasNotation,
  createScopeFn: typeof createScope
) {
  return function createComponent(
    id: ComponentId,
    nameThatMayHaveAlias: string
  ): ComponentObject {
    const parsed = parseAliasNotationFn(nameThatMayHaveAlias);
    return {
      id,
      name: parsed.name,
      alias: parsed.alias,
      scope: createScopeFn(),
    };
  };
}

/**
 * Type guard type for checking if an entity is a Component.
 */
export type IsComponent = (entity: any) => entity is ComponentObject;

/**
 * Type guard to check if an entity is a Component.
 * @param entity
 * @returns
 */
export function isComponent(entity: any): entity is ComponentObject {
  return (
    entity && typeof entity === "object" && "id" in entity && "name" in entity
  );
}
