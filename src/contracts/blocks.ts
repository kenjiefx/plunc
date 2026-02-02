import { ComponentInternalRepresentation } from "../types";

export type SelectBlockElementFunction = (
  context: HTMLElement,
) => HTMLElement[];

export type BlockSelectorFactory = (
  name: string,
  componentInternalRepresentation: ComponentInternalRepresentation,
) => SelectBlockElementFunction;