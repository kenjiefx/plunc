import {
  InvalidComponentFamilyTreeSourceError,
  PluncError,
} from "../errors/pluncError";
import {
  ComponentFamilyTree,
  ComponentFamilyTreeBrand,
  ComponentId,
} from "../types";

type ComponentFamilyTreeInternalImplementation = ComponentFamilyTree & {
  data: {
    [key: ComponentId]: {
      parent: ComponentId | null;
      children: Array<ComponentId>;
    };
  };
};

function getInternalComponentFamilyTree(
  tree: ComponentFamilyTree,
): ComponentFamilyTreeInternalImplementation {
  if ("data" in tree) {
    return tree as ComponentFamilyTreeInternalImplementation;
  }
  throw new PluncError<InvalidComponentFamilyTreeSourceError>("ERR5");
}

export function createComponentLineage(): ComponentFamilyTree {
  const genealogy: ComponentFamilyTreeInternalImplementation = {
    data: {},
    [ComponentFamilyTreeBrand]: true,
  };
  return genealogy;
}

export function addRecordToComponentLineage(
  tree: ComponentFamilyTree,
  parentId: ComponentId,
  childId: ComponentId,
) {
  const internalTree = getInternalComponentFamilyTree(tree);
  if (internalTree.data[parentId] === undefined) {
    internalTree.data[parentId] = {
      parent: null,
      children: [],
    };
  }
  internalTree.data[parentId].children.push(childId);
  if (internalTree.data[childId] === undefined) {
    internalTree.data[childId] = {
      parent: parentId,
      children: [],
    };
  }
}

export function lookupComponentLineage(
  tree: ComponentFamilyTree,
  childId: ComponentId,
): Array<ComponentId> {
  const internalTree = getInternalComponentFamilyTree(tree);
  if (internalTree.data[childId] === undefined) return [];
  const parents: Array<ComponentId> = [];
  let parent = internalTree.data[childId].parent;
  while (parent !== null) {
    parents.push(parent);
    parent = internalTree.data[parent].parent;
  }
  return parents;
}

export function whoAreTheChildrenOfComponent(
  tree: ComponentFamilyTree,
  parentId: ComponentId,
): Array<ComponentId> {
  const internalTree = getInternalComponentFamilyTree(tree);
  if (internalTree.data[parentId] === undefined) return [];
  return internalTree.data[parentId].children;
}

export function whoIsTheParentOfComponent(
  tree: ComponentFamilyTree,
  childId: ComponentId,
): ComponentId | null {
  const internalTree = getInternalComponentFamilyTree(tree);
  if (internalTree.data[childId] === undefined) return null;
  return internalTree.data[childId].parent;
}

export function whoAreTheSiblingsOfComponent(
  tree: ComponentFamilyTree,
  componentId: ComponentId,
): Array<ComponentId> {
  const internalTree = getInternalComponentFamilyTree(tree);
  if (internalTree.data[componentId] === undefined) return [];
  const parentId = internalTree.data[componentId].parent;
  if (parentId === null) return [];
  const siblings = internalTree.data[parentId].children.filter(
    (childId) => childId !== componentId,
  );
  return siblings;
}
