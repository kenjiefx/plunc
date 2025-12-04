import { ComponentFamilyTree, ComponentId } from "../types";

/**
 * A record of components referenced by their IDs
 * of their parents, children, and siblings
 */
export type Lineage = {
  genealogy: ComponentFamilyTree;
};

export function createLineage(): Lineage {
  const genealogy: ComponentFamilyTree = {};
  return { genealogy };
}

/**
 * Adds a parent-child record to the lineage.
 * @param lineage
 * @param parent
 * @param child
 * @returns
 */
export function addRecordToLineage(
  lineage: Lineage,
  parent: ComponentId,
  child: ComponentId | null
) {
  if (lineage.genealogy[parent] === undefined) {
    lineage.genealogy[parent] = {
      parent: null,
      children: [],
    };
  }
  if (child === null) return;
  lineage.genealogy[parent].children.push(child);
  if (lineage.genealogy[child] === undefined) {
    lineage.genealogy[child] = {
      parent,
      children: [],
    };
  }
}

/**
 * Looks up the lineage of a given component ID,
 * returning an array of its ancestor component IDs.
 * @param lineage
 * @param child
 * @returns
 */
export function lookupLineage(
  lineage: Lineage,
  child: ComponentId
): Array<ComponentId> {
  if (lineage.genealogy[child] === undefined) return [];
  const parents: Array<ComponentId> = [];
  let parent = lineage.genealogy[child].parent;
  while (parent !== null) {
    parents.push(parent);
    parent = lineage.genealogy[parent].parent;
  }
  return parents;
}

/**
 * Returns an array of children component IDs for a given parent component ID.
 * @param lineage
 * @param parent
 * @returns
 */
export function whoAreTheChildren(
  lineage: Lineage,
  parent: ComponentId
): Array<ComponentId> {
  if (lineage.genealogy[parent] === undefined) return [];
  return lineage.genealogy[parent].children;
}

/**
 * Returns the parent component ID for a given child component ID.
 * @param lineage
 * @param child
 * @returns
 */
export function whoIsTheParent(
  lineage: Lineage,
  child: ComponentId
): ComponentId | null {
  if (lineage.genealogy[child] === undefined) return null;
  return lineage.genealogy[child].parent;
}

/**
 * Returns an array of sibling component IDs for a given child component ID.
 * @param lineage
 * @param child
 * @returns
 */
export function whoAreTheSiblings(
  lineage: Lineage,
  child: ComponentId
): Array<ComponentId> {
  const parent = whoIsTheParent(lineage, child);
  if (parent === null) return [];
  const siblings = whoAreTheChildren(lineage, parent).filter(
    (sibling) => sibling !== child
  );
  return siblings;
}
