import { ComponentFamilyTree, ComponentId } from "../types";

/**
 * A record of components referenced by their IDs
 * of their parents, children, and siblings
 */
export type Lineage = ReturnType<typeof createLineage>;

export function createLineage() {
  const genealogy: ComponentFamilyTree = {};

  function begat(parent: ComponentId, child: ComponentId | null) {
    if (genealogy[parent] === undefined) {
      genealogy[parent] = {
        parent: null,
        children: [],
      };
    }

    if (child === null) return;

    genealogy[parent].children.push(child);

    if (genealogy[child] === undefined) {
      genealogy[child] = {
        parent,
        children: [],
      };
    }
  }

  function lookup(child: ComponentId): Array<ComponentId> {
    if (genealogy[child] === undefined) return [];

    const parents: Array<ComponentId> = [];
    let parent = genealogy[child].parent;

    while (parent !== null) {
      parents.push(parent);
      parent = genealogy[parent].parent;
    }

    return parents;
  }

  function children(parent: ComponentId): Array<ComponentId> {
    if (genealogy[parent] === undefined) return [];
    return genealogy[parent].children;
  }

  function parent(child: ComponentId): ComponentId | null {
    if (genealogy[child] === undefined) return null;
    return genealogy[child].parent;
  }

  return {
    begat,
    lookup,
    children,
    parent,
  };
}
