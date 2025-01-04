import { __getXAppElement } from "../boot/appElement";
import { XAttr } from "../helpers/attributes";
import { Component } from "../models/component";
import { PluncElement } from "../models/element";
import { Lineage } from "../models/lineage";
import { PluncApp } from "../models/plunc";


export const __componentAPI = (
  component: Component,
  lineage: Lineage,
  instance: PluncApp
) => {
  return {
    id: component.__getId(),
    name: component.__getName(),
    alias: component.__getAlias(),
    element: (): PluncElement | null => {
      if (!instance.__isReady()) {
        throw new Error(`cannot invoke component.get().element() outside $app.ready`)
      }
      let elementNode = XAttr.__getElementByCId(
        __getXAppElement(instance),
        instance,
        component.__getId()
      )
      if (elementNode === null) {
        return null
      }
      return new PluncElement(elementNode)
    }
  }
}