import { ComponentFamilyTree, ComponentId } from "../interface"

/** 
 * A record of components referenced by their IDs
 * of their parents, children, and siblings 
*/
export class Lineage {
  private genealogy: ComponentFamilyTree
  constructor(){
    this.genealogy = {}
  }
  /**
   * In genealogy, "begat" is an archaic term commonly used in historical 
   * texts to indicate parentage, specifically that a man fathered a child. 
   * Similarly, this function registers lineage of parent component and its
   * child components.
   * @param parent 
   * @param child 
   * @returns 
   */
  begat(parent: ComponentId, child: ComponentId | null){
    if (this.genealogy[parent]===undefined) {
      this.genealogy[parent] = {
        parent: null,
        children: []
      }
    }
    if (child===null) return 
    this.genealogy[parent].children.push(child)
    if (this.genealogy[child]===undefined) {
      this.genealogy[child] = {
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
  lookup(child: ComponentId): Array<ComponentId> {
    if (this.genealogy[child]===undefined) return []
    const parents: Array<ComponentId> = []
    let parent = this.genealogy[child].parent 
    while(parent!==null) {
      parents.push(parent)
      parent = this.genealogy[parent].parent
    }
    return parents
  }
  children(parent: ComponentId): Array<ComponentId> {
    if (this.genealogy[parent]===undefined) return []
    const children: Array<ComponentId> = []
    return this.genealogy[parent].children
  }
  parent(child: ComponentId): ComponentId | null {
    if (this.genealogy[child]===undefined) return null 
    return this.genealogy[child].parent
  }
}