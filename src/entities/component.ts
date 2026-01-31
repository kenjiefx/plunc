import { ComponentId, ComponentScope } from "../types";
import { parseAliasNotation } from "../services/aliasNotation";
import { createScope } from "./scope";
import { PluncAppContext } from "../services/contextBinder";
import { PluncApp } from "./plunc";

/**
 * Represents a component (functional version).
 */
export type ComponentObject = {
  id: ComponentId;
  name: string;
  alias: string | null;
  scope: ComponentScope;
  proxy: ComponentExposureProxy | null;
  template: string;
  __brand__: Symbol;
};

/**
 * Represents a proxy for accessing a component's exposed members.
 */
export type ComponentExposureProxy = Record<string, unknown> & {
  __brand__: Symbol;
};

/**
 * Composes a factory function for creating components.
 * @param parseAliasNotation
 * @param createScope
 * @returns
 */
export type ComponentObjectFactory = (
  id: ComponentId,
  nameThatMayHaveAlias: string,
) => ComponentObject;

export function createComponentFactory(
  parseAliasNotationFn: typeof parseAliasNotation,
  createScopeFn: typeof createScope,
) {
  return function createComponent(
    id: ComponentId,
    nameThatMayHaveAlias: string,
  ): ComponentObject {
    const parsed = parseAliasNotationFn(nameThatMayHaveAlias);
    return {
      id,
      name: parsed.name,
      alias: parsed.alias,
      proxy: null,
      scope: createScopeFn(),
      template: `<!-- Component ${id} Template -->`,
      __brand__: Symbol("ComponentObject"),
    };
  };
}

/**
 * Type guard to check if an entity is a Component.
 * @param entity
 * @returns
 */
export function isComponentObject(entity: any): entity is ComponentObject {
  return (
    entity && typeof entity === "object" && "id" in entity && "name" in entity
  );
}

export type ComponentIdGenerator = (
  childIteration: number,
  parentComponentId: ComponentId,
) => ComponentId;

export function composeComponentIdGenerator(appCtx: PluncApp) {
  return function generateComponentId(
    childIteration: number,
    parentComponentId: ComponentId,
  ): ComponentId {
    if (parentComponentId !== "") {
      return `${parentComponentId}.${childIteration.toString()}` as ComponentId;
    }
    return `${appCtx.id.toString()}.${childIteration.toString()}` as ComponentId;
  };
}

export function setExposedToComponent(
  component: ComponentObject,
  exposed: { [key: string]: any },
) {
  return {
    ...component,
    exposed: exposed,
  };
}
