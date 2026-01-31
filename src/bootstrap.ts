import {
  composeComponentIdGenerator,
  createComponentFactory,
  isComponentObject,
} from "./entities/component";
import {
  addToLibrary,
  getComponentHandlerFromLibrary,
  getFactoryHandlerFromLibrary,
  getHelperHandlerFromLibrary,
  getServiceHandlerFromLibrary,
} from "./entities/library";
import {
  addRecordToLineage,
  lookupLineage,
  whoAreTheChildren,
  whoAreTheSiblings,
  whoIsTheParent,
} from "./entities/lineage";
import { createPluncApp, PluncApp } from "./entities/plunc";
import {
  addToRegistry,
  getAllFromRegistry,
  getFromRegistryById,
  getFromRegistryByIds,
} from "./entities/registry";
import { createScope } from "./entities/scope";
import { TemplatesMap } from "./entities/templates";
import { parseAliasNotation } from "./services/aliasNotation";
import { composeBlockElementSelector } from "./services/blockService";
import { composeComponentProxyFactory } from "./services/componentProxy";
import {
  composeComponentRenderer,
  composeComponentSelectorById,
} from "./services/componentService";
import { resolveConfiguration } from "./services/configuration";
import {
  makePluncAppContextBinder,
  PluncAppContext,
} from "./services/contextBinder";
import { composeDirectivesProcessor } from "./services/directivesProcessor";
import { disposeElement } from "./services/disposeService";
import { DOMHelper } from "./services/domReady";
import {
  cleanChildComponents,
  makeStagingElement,
  selectAllElements,
  selectElement,
  selectLiveAppRootElement,
} from "./services/elementService";
import {
  composeComponentBinder,
  composeFactoryBinder,
  composeHelperBinder,
  composeServiceBinder,
} from "./services/handlerBinder";
import {
  composeDependencyResolver,
  invokeComponentHandler,
  listDependencies,
} from "./services/handlerExecutor";
import {
  composeElementLocker,
  composeIsElementLockedChecker,
} from "./services/lockService";
import { composeReferenceAttacher } from "./services/namedElements";
import {
  composeComponentReconciler,
  reconcileChildren,
} from "./services/scopeReconciler";
import { collectTemplateElements } from "./services/templateService";
import { ComponentId, PluncAppConfiguration } from "./types";
import { resolveExpression } from "./services/expResolver";

// A global array to hold all created PluncApp contexts
const contexts: Array<PluncAppContext> = [];

// Create the PluncApp context binder function
const bindContext = makePluncAppContextBinder(
  resolveConfiguration,
  createPluncApp,
  addToLibrary,
  getServiceHandlerFromLibrary,
  getComponentHandlerFromLibrary,
  getFactoryHandlerFromLibrary,
  getHelperHandlerFromLibrary,
  addToRegistry,
  getFromRegistryByIds,
  getFromRegistryById,
  getAllFromRegistry,
  addRecordToLineage,
  lookupLineage,
  whoAreTheChildren,
  whoIsTheParent,
  whoAreTheSiblings,
  parseAliasNotation,
  selectElement,
  selectAllElements,
  composeBlockElementSelector,
  composeComponentSelectorById,
  composeComponentProxyFactory,
  createComponentFactory,
  createScope,
  composeElementLocker,
  composeIsElementLockedChecker,
  disposeElement,
  resolveExpression,
  reconcileChildren,
  cleanChildComponents,
  makeStagingElement,
);

// Attached to the window object to provide a simple interface to interact with
// the Plunc library code. It allows for creating instances of the app, managing
// components, and more. This aims to simplify and provide a clean and intuitive
// interface for working with the application.
// @ts-ignore - window object extension
const plunc = (window["plunc"] = {
  create: (
    applicationName: string,
    configuration: PluncAppConfiguration | null = null,
  ) => {
    const instanceId = contexts.length + 1;
    const appContext = bindContext(instanceId, applicationName, configuration);
    contexts.push(appContext);
    return {
      component: composeComponentBinder(appContext),
      service: composeServiceBinder(appContext),
      factory: composeFactoryBinder(appContext),
      helper: composeHelperBinder(appContext),
    };
  },
});

async function shouldInit(appContext: PluncAppContext): Promise<boolean> {
  return appContext.__getInstance().config.startFn();
}

function createStagingAppElement(
  appCtx: PluncAppContext,
  templatesMap: TemplatesMap,
) {
  const appName = appCtx.__getInstance().name;
  const template = templatesMap.get(appCtx.__getInstance().name);
  if (template === undefined) {
    throw new Error(`Missing app template for: ${appName}`);
  }
  return makeStagingElement(template);
}

async function bootstrap(contexts: Array<PluncAppContext>): Promise<void> {
  if (contexts.length === 0) return;
  const [appContext, ...rest] = contexts;
  if (!(await shouldInit(appContext))) return;
  // Collect all template elements from the HTML context
  const templatesMap = collectTemplateElements(document.body);
  const appStagingElement = createStagingAppElement(appContext, templatesMap);
  const componentIdGenerator = composeComponentIdGenerator(
    appContext.__getInstance(),
  );
  const referenceAttacher = composeReferenceAttacher(
    appContext,
    selectAllElements,
  );
  const renderComponents = composeComponentRenderer(
    appContext,
    templatesMap,
    selectAllElements,
    componentIdGenerator,
    referenceAttacher,
  );
  renderComponents(appStagingElement.getElement(), "" as ComponentId);

  const allComponentObjects = appContext.__getAllFromRegistry();

  // At this point, we have only registered component objects.
  // The type returned by __getAllFromRegistry includes both components and services.
  // However, since we haven't invoked any handlers yet, we can be sure that
  // all registered objects are components at this stage.
  // This should also mean that handler invocation starts with components.
  // All services that aren't depended on by components will not be invoked.
  // The same is true for handlers of factories and helpers.
  for (const componentId in allComponentObjects) {
    const componentObject = allComponentObjects[componentId];
    // For type narrowing purposes
    if (!isComponentObject(componentObject)) continue;
    const dependencyResolver = composeDependencyResolver(
      appContext,
      listDependencies,
    );
    invokeComponentHandler(
      componentObject.name,
      componentObject,
      appContext,
      listDependencies,
      dependencyResolver,
    );
  }

  for (const componentId in allComponentObjects) {
    const componentObject = allComponentObjects[componentId];
    if (!isComponentObject(componentObject)) continue;
    const targetComponentElement = appContext.__querySelectComponentById(
      appStagingElement.getElement(),
      componentObject.id,
    );
    // When the component element is missing, skip rendering
    // This happens when the component is conditionally not rendered
    if (targetComponentElement === null) continue;
    const tempElement = document.implementation.createHTMLDocument().body;
    tempElement.innerHTML = targetComponentElement.innerHTML;
    const idsOfChildren = appContext.__whoAreTheChildren(componentObject.id);
    appContext.__clearChildComponents(tempElement, idsOfChildren);
    const processDirectives = composeDirectivesProcessor(appContext);
    processDirectives(tempElement, componentObject.scope, false);
    const reconcileComponent = composeComponentReconciler(
      reconcileChildren,
      appContext.__querySelectComponentById,
    );
    // At this point, the temp element has the updated structure
    // We can now reconcile it with the target component element
    reconcileComponent(tempElement, targetComponentElement, idsOfChildren);
  }

  // Finally, attach the staging element to the actual app element
  const appElement = selectLiveAppRootElement(appContext.__getInstance().name);
  appElement.replaceChildren();
  appStagingElement.commitTo(appElement);

  // Emit the ready state, and call all registered ready listeners
  appContext.__getInstance().toReady();
  const readyListeners = appContext.__getInstance().onReadyLtns;
  for (let i = 0; i < readyListeners.length; i++) {
    const listener = readyListeners[i];
    listener();
  }

  // Proceed to bootstrap the next context
  bootstrap(rest);
}

DOMHelper.ready(bootstrap.bind(null, contexts));
