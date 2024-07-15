import { ComponentId } from "../interface";
import { Component } from "./component";
import { Service } from "./service";

export class Registry {
  private data: {[id: ComponentId]: Component} | {[name:string]: Service}
  constructor(){
    this.data = {}
  }
  __register(id: ComponentId | string, object: Component | Service){
    this.data[id] = object
  }
  __getByIds(ids: Array<ComponentId|string>){
    const components: Array<Component> = []
    for (const id in this.data) {
      if (ids.includes(id as ComponentId)) {
        components.push(this.data[id])
      }
    }
    return components
  }
  __getById(id: ComponentId | string): Component | Service | null{
    return this.data[id] ?? null
  }
  __getAll(): {[id: ComponentId]: Component} | {[key:string]: Service}{
    return this.data
  }
}