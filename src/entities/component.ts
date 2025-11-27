import { ComponentId } from "../types";
import { ParseAliasNotation } from "../utils/aliasNotation";
import { CreateScope, createScope, Scope } from "./scope";

/**
 * Represents a component (functional version).
 */
export type Component = ReturnType<ReturnType<typeof createComponentFactory>>;

/**
 * Composes a factory function for creating components.
 * @param parseAliasNotation
 * @param createScope
 * @returns
 */
export function createComponentFactory(
  parseAliasNotation: ParseAliasNotation,
  createScope: CreateScope
) {
  return function createComponent(
    id: ComponentId,
    nameThatMayHaveAlias: string
  ) {
    const parsed = parseAliasNotation(nameThatMayHaveAlias);
    return {
      id,
      name: parsed.name,
      alias: parsed.alias,
      scope: createScope(),
    };
  };
}

/**
 * Type guard type for checking if an entity is a Component.
 */
export type IsComponent = (entity: any) => entity is Component;

/**
 * Type guard to check if an entity is a Component.
 * @param entity
 * @returns
 */
export function isComponent(entity: any): entity is Component {
  return (
    entity && typeof entity === "object" && "id" in entity && "name" in entity
  );
}
