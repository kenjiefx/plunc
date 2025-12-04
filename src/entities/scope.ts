import { ComponentScope } from "../types";

/**
 * Creates a new component scope object.
 * @returns A new component scope
 */
export function createScope(): ComponentScope {
  return Object.create(null);
}