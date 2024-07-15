import { __makeComponentProxy } from "../helpers/dependency"
import { ComponentId } from "../interface"
import { Component } from "../models/component"
import { Lineage } from "../models/lineage"
import { PluncApp } from "../models/plunc"
import { Service } from "../models/service"

export const __parentAPI = (
  component: Component,
  lineage: Lineage,
  instance: PluncApp
): {[key:string]: any} | null => {
  const parentid = lineage.parent(component.__getId())
  if (parentid === null) return null 
  const parent = instance.__registry().__getById(parentid)
  if (parent === null) return null
  if (!(parent instanceof Component)) return null 

  const wrapper: {[id:ComponentId]: Component} = {}
  wrapper[parentid] = parent
  
  return __makeComponentProxy(wrapper)
}
