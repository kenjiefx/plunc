import { ComponentFamilyTree, ComponentId } from "../types"

/**
 * @returns A lineage object that can be used to track the genealogy of components.
 */
export function createLineage() {

  const genealogy: ComponentFamilyTree = {}

  /**
   * In genealogy, "begat" is an archaic term commonly used in historical 
   * texts to indicate parentage, specifically that a man fathered a child. 
   * Similarly, this function registers lineage of parent component and its
   * child components.
   * @param parent 
   * @param child 
   * @returns 
   */
  function begat(parent: ComponentId, child: ComponentId | null){
    if (genealogy[parent]===undefined) {
      genealogy[parent] = {
        parent: null,
        children: []
      }
    }
    if (child===null) return 
    genealogy[parent].children.push(child)
    if (genealogy[child]===undefined) {
      genealogy[child] = {
        parent: parent,
        children: []
      }
    }
  }

  /**
   * This method lists all the parents, and the parents of the parents 
   * of the child component in a form of array of Component Ids.
   * @param child 
   * @returns 
   */
  function lookup(child: ComponentId): Array<ComponentId> {
    if (genealogy[child]===undefined) return []
    const parents: Array<ComponentId> = []
    let parent = genealogy[child].parent 
    while(parent!==null) {
      parents.push(parent)
      parent = genealogy[parent].parent
    }
    return parents
  }

  function children(parent: ComponentId): Array<ComponentId> {
    if (genealogy[parent]===undefined) return []
    const children: Array<ComponentId> = []
    return genealogy[parent].children
  }

  function parent(child: ComponentId): ComponentId | null {
    if (genealogy[child]===undefined) return null 
    return genealogy[child].parent
  }

  return {
    begat,
    lookup,
    children,
    parent
  }

}