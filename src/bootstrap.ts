
import { COMPONENT_ELEMENT_ATTR, PLUNC_ID_ATTRIBUTE } from "./utils/attributesList";
import { createPluncAttributeFormatter } from "./utils/pluncAttributeFormatter";
import { createPluncAttributeKeyFormatter } from "./utils/pluncAttributeKeyFormatter";
import { createHTMLDocumentImplementation, documentQuerySelectorAll } from "./utils/documentHelpers";
import { generateConfiguration } from "./utils/generateConfiguration";
import { AppConfiguration, ComponentInstance, PluncAppInstance } from "./types";
import { nameAliasParser } from "./utils/nameAliasParser";
import { createTemplateHtmlGetter } from "./utils/templateHtmlGetter";
import { DOMHelper } from "./utils/domReady";
import { PluncApp, createPluncApp } from "./utils/createPluncApp";
import { createLineage } from "./utils/createLineage";
import { createPluncAttributeValueGetter } from "./utils/pluncAttributeValueGetter";
import { makeComponentIdGenerator } from "./utils/makeComponentId";
import { createParentComponentBuilder } from "./utils/buildComponentAsParent";
import { createReferenceIdAttacher } from "./utils/referenceIdAttacher";

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
  create: (applicationName: string, config: AppConfiguration | null = null): PluncAppInstance => {
    const configuration = generateConfiguration(config)
    const instance = createPluncApp(
      instanceId, 
      applicationName,
      configuration
    )
    instances.push(instance)
    return {
      /**
       * @see PluncAppInstance.component for definition
       * @param name 
       * @param handler 
       */
      component: (name, handler) => {
        instance.handlers.registerHandler(name, 'component', handler)
      },

      /**
       * @see PluncAppInstance.service for definition
       * @param name 
       * @param handler 
       */
      service: (name, handler) => {
        instance.handlers.registerHandler(name, 'service', handler)
      },

      /**
       * @see PluncAppInstance.factory for definition
       * @param name 
       * @param handler 
       */
      factory: (name, handler) => {
        instance.handlers.registerHandler(name, 'factory', handler)
      },

      /**
       * @see PluncAppInstance.helper for definition
       * @param name 
       * @param handler 
       */
      helper: (name, handler) => {
        instance.handlers.registerHandler(name, 'helper', handler)
      }
    }
  }
}

/**
 * Exposes the public API for the Plunc application, allowing users to create 
 * instances and register components, services, factories, and helpers.
 */
const plunc = window['plunc'] = AppPublicAPI

DOMHelper.ready(async () => {
  for (let i = 0; i < instances.length; i++) {
    const pluncAppInstance = instances[i]
    try {

      const appInstanceName = pluncAppInstance.name
      if (!await pluncAppInstance.configuration.startFn()) continue

      const pluncAttributeKeyFormatter = createPluncAttributeKeyFormatter(pluncAppInstance.configuration)
      const pluncAttributeFormatter = createPluncAttributeFormatter(pluncAttributeKeyFormatter)
      const pluncAttributeValueGetter = createPluncAttributeValueGetter(pluncAttributeKeyFormatter)
      const templateHtmlGetter = createTemplateHtmlGetter(nameAliasParser, pluncAttributeFormatter)
      const componentIdGenerator = makeComponentIdGenerator(pluncAppInstance)
      const referenceIdAttacher = createReferenceIdAttacher(pluncAttributeKeyFormatter, pluncAttributeValueGetter)
      const buildComponentAsParent = createParentComponentBuilder(
        pluncAttributeValueGetter,
        nameAliasParser,
        templateHtmlGetter,
        createHTMLDocumentImplementation,
        referenceIdAttacher
      )

      // Create the HTML document implementation for the app instance
      const implementation = createHTMLDocumentImplementation(appInstanceName)
      implementation.body.innerHTML = templateHtmlGetter(document)(appInstanceName)

      // Query all elements with the plunc component attribute
      const componentAttribute = pluncAttributeKeyFormatter(COMPONENT_ELEMENT_ATTR)
      const allComponentElements = implementation.body.querySelectorAll(`[${componentAttribute}]`)
      
      let componentIteration = 0
      const lineage = createLineage()

      for (let j = 0; j < allComponentElements.length; j++) {

        const componentElement = allComponentElements[j]
        const componentName = pluncAttributeValueGetter(componentElement, COMPONENT_ELEMENT_ATTR)

        // If the component name is not defined, skip this element
        if (componentName === null) continue

        // Embed the component id into the component element
        const componentId = componentIdGenerator(componentIteration++)
        const idAttributeKey = pluncAttributeKeyFormatter(PLUNC_ID_ATTRIBUTE)
        componentElement.setAttribute(idAttributeKey, componentId)

        // Register the component in the lineage as parent
        lineage.begat(componentId, null)

        // Get component actual name and alias
        const { name: componentActualName, alias: componentAlias } = nameAliasParser(componentName)

        const componentObject: ComponentInstance = {
          id: componentId,
          name: componentActualName,
          alias: componentAlias,
          scope: {}
        }

        // Register the component in the PluncApp instance
        pluncAppInstance.instances.registerInstance(componentId, componentObject)

        
      }

    } catch (error) {
      const message = `plunc.js error: ${error.message}`
      error.message = message
      console.error(error)
    }
  }
})

