import { Component } from "../models/component";
import { PluncApp } from "../models/plunc";
import { __checkRenders } from "./check";
import { __conditionalRenders } from "./conditional";
import { __disableRenders } from "./disable";
import { __eventBinders } from "./events";
import { __modelRenders } from "./model";
import { __placeholderRenders } from "./placeholders";
import { __repeatRenders } from "./repeat";
import { __styleRenders } from "./style";

export const __renderHelper = (
  element: Element, 
  component: Component, 
  instance: PluncApp,
  skipEvents: boolean = false
): Promise<void> => {
  return new Promise (async (resolve, reject)=>{
    try {
      await __repeatRenders(element, component, instance)
      await __conditionalRenders(element, component, instance)
      await __placeholderRenders(element, component, instance)
      await __checkRenders(element, component, instance)
      await __styleRenders(element, component, instance)
      await __modelRenders(element, component, instance)
      await __disableRenders(element, component, instance)

      if (!skipEvents) {
        await __eventBinders(element, component, instance)
    }
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}