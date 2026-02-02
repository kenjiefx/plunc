import { ComponentId, ComponentInternalRepresentation } from "../types";

/**
 * Composes a factory function for creating component internal representations.
 * @param aliasParser
 */
export type ComponentInternalRepresentationFactory = (
  id: ComponentId,
  nameThatMayHaveAlias: string,
) => ComponentInternalRepresentation;

/**
 * Generates a unique ComponentId based on the parent component's ID and the child's iteration.
 * @param childIteration - The iteration index of the child component.
 * @param parentComponentId - The ComponentId of the parent component.
 * @returns A unique ComponentId for the child component.
 */
export type ComponentIdGenerator = (
  childIteration: number,
  parentComponentId: ComponentId,
) => ComponentId;

/**
 * Composes a proxy for accessing component's exposed members.
 * Why a proxy? To provide a dynamic access to the component's exposed members,
 * allowing for lazy evaluation and error handling when accessing undefined members.
 * @param wrapper
 * @returns
 */
export type ComponentProxyFactory = (wrapper: {
  [id in ComponentId]: ComponentInternalRepresentation;
}) => { [id in ComponentId]: ComponentInternalRepresentation };

export type ComponentProxyWrapper = {
  [id in ComponentId]: ComponentInternalRepresentation;
};

/**
 * Attaches Component Id reference to named elements within a component.
 * This would label all named elements inside the component with a reference
 * to the component's unique ID, facilitating easier lookup and management.
 */
export type ComponentReferenceAttacher = (
  referenceId: string,
  component: HTMLElement,
) => void;