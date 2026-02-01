import { ComponentFamilyTree, ComponentId } from "../types";

export type CreateComponentFamilyTreeFunction = () => ComponentFamilyTree;
export type AddParentChildRecordFunction = (
  tree: ComponentFamilyTree,
  parentId: ComponentId,
  childId: ComponentId,
) => void;

export type GetComponentAncestorsFunction = (
  tree: ComponentFamilyTree,
  childId: ComponentId,
) => Array<ComponentId>;

export type GetComponentChildrenFunction = (
  tree: ComponentFamilyTree,
  parentId: ComponentId,
) => Array<ComponentId>;

export type GetComponentParentFunction = (
  tree: ComponentFamilyTree,
  childId: ComponentId,
) => ComponentId | null;

export type GetComponentSiblingsFunction = (
  tree: ComponentFamilyTree,
  componentId: ComponentId,
) => Array<ComponentId>;
