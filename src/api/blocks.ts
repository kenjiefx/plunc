import { __getXAppElement } from "../boot/appElement";
import { BLOCK_ELEMENT_ATTR, ELEMENT_REFERENCE_ATTR, XAttr } from "../helpers/attributes";
import { BlockCallback } from "../interface";
import { Component } from "../models/component";
import { PluncElement } from "../models/element";
import { PluncApp } from "../models/plunc";

export const __blockAPI = (
  component: Component,
  instance: PluncApp,
  name: string,
  callback: BlockCallback<Element>
) => {
  if (!instance.__isReady()) {
    throw new Error(`cannot use $block outside $app.ready`)
  }
  const blockAttribute 
    = XAttr.__createWithValue(BLOCK_ELEMENT_ATTR, instance, name)
  const cElement = XAttr.__getElementByCId(
    __getXAppElement(instance),
    instance,
    component.__getId()
  )
  if (cElement === null) {
    throw new Error('unknown component element')
  }
  const refAttribute = XAttr.__createWithValue(
    ELEMENT_REFERENCE_ATTR,
    instance,
    component.__getId()
  )
  const blocks = cElement.querySelectorAll(`[${blockAttribute}][${refAttribute}]`)
  for (let i = 0; i < blocks.length; i++) {
    callback(new PluncElement(blocks[i]))
  }
}