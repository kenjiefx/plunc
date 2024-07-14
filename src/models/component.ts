import { ComponentId, PluncAttributeKey } from "../interface"
import { Lineage } from "./lineage"
import { Scope } from "./scope"

export class Component {
  private id: ComponentId
  private name: string 
  private scope: Scope
  private exposed: {[key:string]:any} | null
  constructor(
    id: ComponentId, 
    name: string
  ) {
    this.id = id
    this.name = name
    this.scope = new Scope
    this.exposed = null
  }
  __getName(){
    return this.name
  }
  __getId(){
    return this.id
  }
  __getScope(){
    return this.scope
  }
  __importScope(scope: Scope){
    this.scope = scope
  }
  __setExposed(object:{[key:string]:any}) {
    if (this.exposed===null) {
      this.exposed = object
    }
  }
  __getExposed(){
    return this.exposed
  }
}