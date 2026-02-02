import {
  composePluncAppContainerFactory,
  PluncAppContainer,
} from "./container";
import { parseAliasNotation } from "./services/aliasNotation";
import { composeBlockElementSelector } from "./services/blockService";
import { composeComponentProxyFactory } from "./services/componentProxy";
import {
  composeComponentIdGenerator,
  composeComponentRenderer,
  composeComponentSelectorById,
  createComponentInternalRepresentationFactory,
} from "./services/componentService";
import { resolveConfiguration } from "./services/configuration";
import { composeDirectivesProcessor } from "./services/directivesProcessor";
import { disposeElement } from "./services/disposeService";
import { DOMHelper } from "./services/domReady";
import {
  composeChildComponentCleaner,
  composeElementSelectorsWithPluncAttribute,
  composePluncAttributeValueGetter,
  composePluncAttributeValueSetter,
  selectAllElements,
  selectElement,
  selectLiveAppRootElement,
} from "./services/elementService";
import { resolvePluncExpression } from "./services/expressionResolver";
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
  addHandlerToLibrary,
  createNewHandlerLibrary,
  getComponentHandlerFromLibrary,
  getFactoryHandlerFromLibrary,
  getHelperHandlerFromLibrary,
  getServiceHandlerFromLibrary,
} from "./services/libraryService";
import {
  addRecordToComponentLineage,
  createComponentLineage,
  lookupComponentLineage,
  whoAreTheChildrenOfComponent,
  whoAreTheSiblingsOfComponent,
  whoIsTheParentOfComponent,
} from "./services/lineageService";
import {
  composeElementLocker,
  composeEventLocker,
  composeIsElementLockedChecker,
  composeIsEventLockChecker,
} from "./services/lockService";
import { composeReferenceAttacher } from "./services/namedElements";
import { createPluncAppInternalRepresentation } from "./services/pluncAppService";
import { composePluncAttributeKeyFormatter } from "./services/pluncAttribute";
import {
  addComponentToRegistry,
  addServiceToRegistry,
  createNewComponentAndServiceRegistry,
  getAllComponentsFromRegistry,
  getComponentFromRegistryById,
  getComponentsFromRegistryByIds,
  getServiceFromRegistryById,
  getServicesFromRegistryByIds,
} from "./services/registryService";
import {
  composeComponentReconciler,
  reconcileChildren,
} from "./services/scopeReconciler";
import {
  commitStagingElementTo,
  createStagingElement,
  getStagingElementInnerHtml,
  setStagingElementInnerHtml,
} from "./services/stagingElement";
import { collectTemplateElementsInnerHtml } from "./services/templateService";
import { ComponentId, PluncAppConfiguration } from "./types";

// A global array to hold all created PluncApp container
const contexts: Array<PluncAppContainer> = [];

// Create the PluncApp context binder function
const createContainer = composePluncAppContainerFactory(
  createPluncAppInternalRepresentation,
  createNewComponentAndServiceRegistry,
  addComponentToRegistry,
  getComponentFromRegistryById,
  getComponentsFromRegistryByIds,
  getAllComponentsFromRegistry,
  addServiceToRegistry,
  getServiceFromRegistryById,
  getServicesFromRegistryByIds,
  createNewHandlerLibrary,
  addHandlerToLibrary,
  getServiceHandlerFromLibrary,
  getComponentHandlerFromLibrary,
  getFactoryHandlerFromLibrary,
  getHelperHandlerFromLibrary,
  createComponentLineage,
  addRecordToComponentLineage,
  lookupComponentLineage,
  whoAreTheChildrenOfComponent,
  whoIsTheParentOfComponent,
  whoAreTheSiblingsOfComponent,
  composePluncAttributeKeyFormatter,
  composePluncAttributeValueGetter,
  composePluncAttributeValueSetter,
  parseAliasNotation,
  composeComponentIdGenerator,
  selectElement,
  selectAllElements,
  composeComponentSelectorById,
  composeElementSelectorsWithPluncAttribute,
  composeElementLocker,
  composeIsElementLockedChecker,
  composeIsEventLockChecker,
  composeEventLocker,
  disposeElement,
  composeChildComponentCleaner,
  composeBlockElementSelector,
  createComponentInternalRepresentationFactory,
  composeComponentProxyFactory,
  resolvePluncExpression,
  createStagingElement,
  setStagingElementInnerHtml,
  getStagingElementInnerHtml,
  commitStagingElementTo,
);

// Attached to the window object to provide a simple interface to interact with
// the Plunc library code. It allows for creating instances of the app, managing
// components, and more. This aims to simplify and provide a clean and intuitive
// interface for working with the application.
export const plunc = {
  create: (
    applicationName: string,
    configuration: PluncAppConfiguration | null = null,
  ) => {
    const instanceId = contexts.length + 1;
    const appContainer = createContainer(
      instanceId,
      applicationName,
      configuration,
    );
    contexts.push(appContainer);
    return {
      component: composeComponentBinder(appContainer),
      service: composeServiceBinder(appContainer),
      factory: composeFactoryBinder(appContainer),
      helper: composeHelperBinder(appContainer),
    };
  },
};

async function shouldInit(appContainer: PluncAppContainer): Promise<boolean> {
  return appContainer.__getAppRepresentationInstance().config.startFn();
}

async function bootstrap(contexts: Array<PluncAppContainer>): Promise<void> {
  if (contexts.length === 0) return;
  const [appContainer, ...rest] = contexts;
  if (!(await shouldInit(appContainer))) return;
  // Collect all template elements from the HTML context
  const templatesMap = collectTemplateElementsInnerHtml(document.body);
  const appStagingElement = createStagingElement(
    templatesMap.get(appContainer.__getAppRepresentationInstance().name),
  );
  const componentIdGenerator = composeComponentIdGenerator(
    appContainer.__getAppRepresentationInstance(),
  );
  const referenceAttacher = composeReferenceAttacher(
    appContainer,
    selectAllElements,
  );
  const renderComponents = composeComponentRenderer(
    appContainer,
    templatesMap,
    selectAllElements,
    componentIdGenerator,
    referenceAttacher,
  );
  renderComponents(appStagingElement, "" as ComponentId);

  const allComponentInternalRepresentation =
    appContainer.__getAllComponentsFromRegistry();

  // At this point, we have only registered component objects.
  // All services that aren't depended on by components will not be invoked.
  // The same is true for handlers of factories and helpers.
  for (const componentId in allComponentInternalRepresentation) {
    const componentInternalRepresentation =
      allComponentInternalRepresentation[componentId];
    const dependencyResolver = composeDependencyResolver(
      appContainer,
      listDependencies,
    );
    invokeComponentHandler(
      componentInternalRepresentation.name,
      componentInternalRepresentation,
      appContainer,
      listDependencies,
      dependencyResolver,
    );
  }

  for (const componentId in allComponentInternalRepresentation) {
    const componentInternalRepresentation =
      allComponentInternalRepresentation[componentId];
    const targetComponentElement = appContainer.__querySelectComponentById(
      appStagingElement,
      componentInternalRepresentation.id,
    );
    // When the component element is missing, skip rendering
    // This happens when the component is conditionally not rendered
    if (targetComponentElement === null) continue;
    const tempElement = document.implementation.createHTMLDocument().body;
    tempElement.innerHTML = targetComponentElement.innerHTML;
    const idsOfChildren = appContainer.__whoAreTheChildren(
      componentInternalRepresentation.id,
    );
    appContainer.__clearChildComponents(tempElement, idsOfChildren);
    const processDirectives = composeDirectivesProcessor(appContainer);
    processDirectives(
      tempElement,
      componentInternalRepresentation.scope,
      false,
    );
    const reconcileComponent = composeComponentReconciler(
      reconcileChildren,
      appContainer.__querySelectComponentById,
    );
    // At this point, the temp element has the updated structure
    // We can now reconcile it with the target component element
    reconcileComponent(tempElement, targetComponentElement, idsOfChildren);
  }

  // Finally, attach the staging element to the actual app element
  const appElement = selectLiveAppRootElement(
    appContainer.__getAppRepresentationInstance().name,
  );
  appElement.replaceChildren();
  appContainer.__commitStagingElementTo(appStagingElement, appElement);

  // Emit the ready state, and call all registered ready listeners
  appContainer.__getAppRepresentationInstance().__emitReady();
  const readyListeners = appContainer
    .__getAppRepresentationInstance()
    .__getReadyListeners();
  for (let i = 0; i < readyListeners.length; i++) {
    const listener = readyListeners[i];
    listener();
  }

  // Proceed to bootstrap the next context
  bootstrap(rest);
}

DOMHelper.ready(bootstrap.bind(null, contexts));
