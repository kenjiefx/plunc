import { __generateConf } from "./helpers/config";
import { AppConfiguration, PluncAppInstance } from "./interface";
import { PluncApp } from "./models/plunc";
import { DOMHelper } from "./helpers/domready";
import { __initStartFn } from "./helpers/startFn";
import { __getXAppElement } from "./boot/appElement";
import { __getTempl } from "./helpers/templates";
import { COMPONENT_ELEMENT_ATTR, XAttr } from "./helpers/attributes";
import { __buildComponent, __makeComponentId } from "./helpers/component";
import { Lineage } from "./models/lineage";
import { Component } from "./models/component";
import { __executeComponentHandler } from "./helpers/handlers";
import { __renderHelper } from "./renders/index";
import { __clearChildComponents, __copyBindElement, __makeTempElement, __scopeBindElement } from "./helpers/elements";

/** 
 * Stores all created PluncApp instances
 */
const instances: Array<PluncApp> = []

/**
 * This value increments, serving as the unique id 
 * of the PluncApp instance.
 */
let instanceId = 0


/**
 * Attached to the window object to provide a simple interface to interact with 
 * the Plunc library code. It allows for creating instances of the app, managing
 * components, and more. This aims to simplify and provide a clean and intuitive 
 * interface for working with the application.
 */
const AppPublicAPI = {
  create: (applName: string, config: AppConfiguration | null = null): PluncAppInstance => {
    const reqConf = __generateConf(config)
    const instance = new PluncApp(
      applName, 
      instanceId++,
      reqConf
    )
    instances.push(instance)
    return {

      /**
       * @see PluncAppInstance.component for definition
       * @param name 
       * @param handler 
       */
      component: (name, handler) => {
        instance.__library()
          .__register(name, 'component', handler)
      },

      /**
       * @see PluncAppInstance.service for definition
       * @param name 
       * @param handler 
       */
      service: (name, handler) => {
        instance.__library()
          .__register(name, 'service', handler)
      },

      /**
       * @see PluncAppInstance.factory for definition
       * @param name 
       * @param handler 
       */
      factory: (name, handler) => {
        instance.__library()
          .__register(name, 'factory', handler)
      },

      /**
       * @see PluncAppInstance.helper for definition
       * @param name 
       * @param handler 
       */
      helper: (name, handler) => {
        instance.__library()
          .__register(name, 'helper', handler)
      }
    }
  }
}

/**
 * Attached to the window object to provide a simple interface to interact with 
 * the Plunc library code. It allows for creating instances of the app, managing
 * components, and more. This aims to simplify and provide a clean and intuitive 
 * interface for working with the application.
 */
const plunc = window['plunc'] = AppPublicAPI


DOMHelper.ready(async ()=>{
  for (let i = 0; i < instances.length; i++) {
    const instance = instances[i]
    try {

      const name = instance.__getName()

      const shouldProceed = await __initStartFn(instance)
      if (!shouldProceed) continue

      /**
       * Creating a new document object where we operate on
       * templates and render all components.
       */
      const implementation = (
        document.implementation.createHTMLDocument(name)
      )
      implementation.body.innerHTML = __getTempl(instance, name)
      
      /**
       * Compiling all the components in the app template, as well
       * as the dependencies of these components.
       */
      const cAttr = XAttr.__create(COMPONENT_ELEMENT_ATTR, instance)
      const cEls = implementation.body.querySelectorAll(`[${cAttr}]`)
      let cId = 0

      /** Creating a new lineage of components */
      const lineage = new Lineage()

      let compiledHtml = ''

      for (let j = 0; j < cEls.length; j++) {

        const cEl   = cEls[j]
        const cName = XAttr.__getValue(cEl, instance, COMPONENT_ELEMENT_ATTR)

        /** 
         * Component without names will not be rendered
         */
        if (cName === null) continue

        /** Component IDs would have to be embedded to the plunc-id attribute */
        const cElId = __makeComponentId(instance, cId++)
        const cElAttr = XAttr.__create('id', instance)
        cEl.setAttribute(cElAttr, cElId)

        lineage.begat(cElId, null)

        /** Registering the component object */
        const cObject = new Component(cElId, cName)
        instance.__registry().__register(cElId, cObject)
        
        /** 
         * Retrieving component templates, as well as the templates of their dependencies,
         * and the dependencies of their dependencies.
         */
        cEl.innerHTML = await  __buildComponent(cElId, cEl, instance, lineage)

      }

      /** All registered components */
      const cRegistered = instance.__registry().__getAll()
      for (const id in cRegistered) {
        await __executeComponentHandler(
          cRegistered[id],
          instance,
          lineage
        )
      }

      const appEl = __makeTempElement()
      appEl.innerHTML = implementation.body.innerHTML

      for (const id in cRegistered) {
        const component = cRegistered[id]
        if (!(component instanceof Component)) continue
        const cId = component.__getId()
        const targetEl 
          = XAttr.__getElementByCId(appEl, instance, cId)

        /** 
         * This happens for the following circumstances: 
         * - When the component is added inside an xif element
         */
        if (targetEl===null) continue
        const tempEl = __makeTempElement()
        tempEl.innerHTML = targetEl.innerHTML
        __clearChildComponents(tempEl, lineage.children(cId), instance)

        await __renderHelper(tempEl, component, instance)
        __scopeBindElement(
          tempEl,
          targetEl,
          instance,
          lineage.children(cId)
        )
        
      }

      const appElement = __getXAppElement(instance)
      __copyBindElement(appEl,appElement)

      const readys = instance.__getAPI().__getListeners('ready')
      for (let o = 0; o < readys.length; o++) {
        readys[o]()
      }
      instance.__nowReady()
      
    } catch (error) {
      console.error(`plunc.js error: ${error.message}`)
    } 
    
  }
})