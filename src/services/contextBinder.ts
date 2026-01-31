import {
  ComponentIdGenerator,
  ComponentObject,
  ComponentObjectFactory,
  composeComponentIdGenerator,
  createComponentFactory,
} from "../entities/component";
import {
  addToLibrary,
  getComponentHandlerFromLibrary,
  getFactoryHandlerFromLibrary,
  getHelperHandlerFromLibrary,
  getServiceHandlerFromLibrary,
  Library,
} from "../entities/library";
import {
  addRecordToLineage,
  Lineage,
  lookupLineage,
  whoAreTheChildren,
  whoAreTheSiblings,
  whoIsTheParent,
} from "../entities/lineage";
import { createPluncApp, PluncApp } from "../entities/plunc";
import {
  addToRegistry,
  getAllFromRegistry,
  getFromRegistryById,
  getFromRegistryByIds,
  Registry,
} from "../entities/registry";
import { createScope } from "../entities/scope";
import { ServiceObject } from "../entities/service";
import {
  ComponentId,
  FactoryHandlerFunction,
  HandlerFunction,
  HelperHandlerFunction,
  PluncAppConfiguration,
  StagingHTMLElement,
} from "../types";
import { AliasNotationParser, parseAliasNotation } from "./aliasNotation";
import {
  BlockSelectorCreator,
  composeBlockElementSelector,
} from "./blockService";
import {
  ComponentProxyFactory,
  composeComponentProxyFactory,
} from "./componentProxy";
import {
  ComponentSelectorById,
  composeComponentSelectorById,
} from "./componentService";
import { ConfigurationResolver } from "./configuration";
import {
  composeDirectivesProcessor,
  DirectivesProcessor,
} from "./directivesProcessor";
import { disposeElement } from "./disposeService";
import {
  ChildComponentCleaner,
  cleanChildComponents,
  composeElementSelectorsWithPluncAttribute,
  composePluncAttributeValueGetter,
  composePluncAttributeValueSetter,
  ElementSelector,
  ElementsSelector,
  ElementsSelectorWithPluncAttribute,
  makeStagingElement,
  PluncAttributeValueGetter,
  PluncAttributeValueSetter,
  selectAllElements,
  selectElement,
} from "./elementService";
import {
  composeElementLocker,
  composeIsElementLockedChecker,
  ElementLocker,
  IsElementLockedChecker,
} from "./lockService";
import {
  composePluncAttributeKeyFormatter,
  PluncAttributeKeyFormatter,
} from "./pluncAttribute";
import { reconcileChildren } from "./scopeReconciler";

export type PluncAppContext = {
  __getInstance: () => PluncApp;
  __addToLibrary: (
    name: string,
    type: "component" | "service" | "factory" | "helper",
    handler: HandlerFunction<any, any>,
  ) => void;
  __getServiceHandler: (name: string) => HandlerFunction<any, any> | null;
  __getComponentHandler: (name: string) => HandlerFunction<any, any>;
  __getFactoryHandler: (name: string) => FactoryHandlerFunction<any> | null;
  __getHelperHandler: (name: string) => HelperHandlerFunction<any, any> | null;
  __addRecordToLineage: (
    parent: ComponentId,
    child: ComponentId | null,
  ) => void;
  __lookupLineage: (child: ComponentId) => Array<ComponentId>;
  __whoAreTheChildren: (parent: ComponentId) => Array<ComponentId>;
  __whoIsTheParent: (child: ComponentId) => ComponentId | null;
  __whoAreTheSiblings: (child: ComponentId) => Array<ComponentId>;
  __getLineage: () => Lineage;
  __addRecordToRegistry: (
    id: ComponentId | string,
    entity: ComponentObject | ServiceObject,
  ) => void;
  __getFromRegistryByIds: (
    ids: Array<ComponentId | string>,
  ) => Array<ComponentObject | ServiceObject>;
  __getFromRegistryById: (
    id: ComponentId | string,
  ) => ComponentObject | ServiceObject | null;
  __getAllFromRegistry: () => Record<string, ComponentObject | ServiceObject>;
  __pluncAttributeKeyFormatter: PluncAttributeKeyFormatter;
  __pluncAttributeValueGetter: PluncAttributeValueGetter;
  __pluncAttributeValueSetter: PluncAttributeValueSetter;
  __aliasNotationParser: AliasNotationParser;
  __generateComponentId: ComponentIdGenerator;
  __querySelectElement: ElementSelector;
  __querySelectAllElements: ElementsSelector;
  __querySelectComponentById: ComponentSelectorById;
  __querySelectAllByPluncAttribute: ElementsSelectorWithPluncAttribute;
  __createBlockSelector: BlockSelectorCreator;
  __createComponentObject: ComponentObjectFactory;
  __createComponentProxy: ComponentProxyFactory;
  __lockElement: ElementLocker;
  __isElementLocked: IsElementLockedChecker;
  __trashElement: typeof disposeElement;
  __resolveExpression: (
    dataCtx: { [key: string]: unknown },
    expression: string,
  ) => unknown;
  __reconcileChildren: typeof reconcileChildren;
  __clearChildComponents: ChildComponentCleaner;
  __createStagingElement: (innerHtml?: string) => StagingHTMLElement;
};

/**
 * A function that binds contexts into a PluncApp instance.
 * This function wires up dependencies like configuration, registry, and library
 * and composes some functions that require access to the app context.
 * @param instanceId
 * @param applicationName
 * @param configuration
 */
export type PluncAppContextBinder = (
  instanceId: number,
  applicationName: string,
  configuration: PluncAppConfiguration | null,
) => PluncAppContext;

/**
 * Creates a PluncApp context binder function
 * @param configResolver
 * @param createPluncAppFn
 * @returnss
 */
export function makePluncAppContextBinder(
  configResolver: ConfigurationResolver,
  createPluncAppFn: typeof createPluncApp,
  addToLibraryFn: typeof addToLibrary,
  getServiceHandlerFn: typeof getServiceHandlerFromLibrary,
  getComponentHandlerFn: typeof getComponentHandlerFromLibrary,
  getFactoryHandlerFn: typeof getFactoryHandlerFromLibrary,
  getHelperHandlerFn: typeof getHelperHandlerFromLibrary,
  addToRegistryFn: typeof addToRegistry,
  getFromRegistryByIdsFn: typeof getFromRegistryByIds,
  getFromRegistryByIdFn: typeof getFromRegistryById,
  getAllFromRegistryFn: typeof getAllFromRegistry,
  addRecordToLineageFn: typeof addRecordToLineage,
  lookupLineageFn: typeof lookupLineage,
  whoAreTheChildrenFn: typeof whoAreTheChildren,
  whoIsTheParentFn: typeof whoIsTheParent,
  whoAreTheSiblingsFn: typeof whoAreTheSiblings,
  parseAliasNotationFn: typeof parseAliasNotation,
  selectElementFn: typeof selectElement,
  selectAllElementsFn: typeof selectAllElements,
  composeBlockElementSelectorFn: typeof composeBlockElementSelector,
  composeComponentSelectorByIdFn: typeof composeComponentSelectorById,
  composeComponentProxyFactoryFn: typeof composeComponentProxyFactory,
  createComponentFactoryFn: typeof createComponentFactory,
  createScopeObjectFn: typeof createScope,
  composeElementLockerFn: typeof composeElementLocker,
  composeElementLockCheckerFn: typeof composeIsElementLockedChecker,
  disposeElementFn: typeof disposeElement,
  resolveExpression: (
    dataCtx: { [key: string]: unknown },
    expression: string,
  ) => unknown,
  reconcileChildrenFn: typeof reconcileChildren,
  cleanChildComponentsFn: typeof cleanChildComponents,
  makeStagingElementFn: typeof makeStagingElement,
): PluncAppContextBinder {
  return function bindPluncAppContext(
    instanceId: number,
    applicationName: string,
    configuration: PluncAppConfiguration | null = null,
  ) {
    const requiredConfiguration = configResolver(configuration);
    const registry: Registry = { data: {} };
    const library: Library = { data: {} };
    const lineage: Lineage = { genealogy: {} };
    const instance = createPluncAppFn(
      applicationName,
      instanceId,
      requiredConfiguration,
      registry,
      library,
    );
    const attributeKeyFormatter = composePluncAttributeKeyFormatter(instance);
    const attributeValueGetter = composePluncAttributeValueGetter(
      attributeKeyFormatter,
    );
    const attributeValueSetter = composePluncAttributeValueSetter(
      attributeKeyFormatter,
    );
    const generateComponentId = composeComponentIdGenerator(instance);
    const blockSelectorCreator = composeBlockElementSelectorFn(
      attributeKeyFormatter,
      selectAllElementsFn,
    );
    const componentSelectorById = composeComponentSelectorByIdFn(
      attributeKeyFormatter,
      selectElementFn,
    );
    const componentObjectFactory = createComponentFactoryFn(
      parseAliasNotationFn,
      createScopeObjectFn,
    );
    const querySelectorByPluncAttribute =
      composeElementSelectorsWithPluncAttribute(
        selectAllElementsFn,
        attributeKeyFormatter,
      );

    return {
      __getInstance: function () {
        return instance;
      },
      __addToLibrary: function (
        name: string,
        type: "component" | "service" | "factory" | "helper",
        handler: HandlerFunction<any, any>,
      ) {
        addToLibraryFn(library, name, type, handler);
      },
      __getServiceHandler: function (name: string) {
        return getServiceHandlerFn(library, name);
      },
      __getComponentHandler: function (name: string) {
        return getComponentHandlerFn(library, name);
      },
      __getFactoryHandler: function (name: string) {
        return getFactoryHandlerFn(library, name);
      },
      __getHelperHandler: function (name: string) {
        return getHelperHandlerFn(library, name);
      },
      __addRecordToRegistry: function (
        id: ComponentId | string,
        entity: ComponentObject | ServiceObject,
      ) {
        addToRegistryFn(registry, id, entity);
      },
      __getFromRegistryByIds: function (ids: Array<ComponentId | string>) {
        return getFromRegistryByIdsFn(registry, ids);
      },
      __getFromRegistryById: function (id: ComponentId | string) {
        return getFromRegistryByIdFn(registry, id);
      },
      __getAllFromRegistry: function () {
        return getAllFromRegistryFn(registry);
      },
      __addRecordToLineage: function (
        parent: ComponentId,
        child: ComponentId | null,
      ) {
        addRecordToLineageFn(lineage, parent, child);
      },
      __whoAreTheChildren: function (parent: ComponentId) {
        return whoAreTheChildrenFn(lineage, parent);
      },
      __whoIsTheParent: function (child: ComponentId) {
        return whoIsTheParentFn(lineage, child);
      },
      __whoAreTheSiblings: function (child: ComponentId) {
        return whoAreTheSiblingsFn(lineage, child);
      },
      __lookupLineage: function (child: ComponentId) {
        return lookupLineageFn(lineage, child);
      },
      __getLineage: function () {
        return lineage;
      },
      __pluncAttributeKeyFormatter: attributeKeyFormatter,
      __pluncAttributeValueGetter: attributeValueGetter,
      __pluncAttributeValueSetter: attributeValueSetter,
      __aliasNotationParser: parseAliasNotationFn,
      __generateComponentId: generateComponentId,
      __querySelectElement: selectElementFn,
      __querySelectAllElements: selectAllElementsFn,
      __querySelectComponentById: componentSelectorById,
      __createBlockSelector: blockSelectorCreator,
      __createComponentProxy: composeComponentProxyFactoryFn(),
      __createComponentObject: componentObjectFactory,
      __querySelectAllByPluncAttribute: querySelectorByPluncAttribute,
      __lockElement: composeElementLockerFn(attributeKeyFormatter),
      __isElementLocked: composeElementLockCheckerFn(attributeKeyFormatter),
      __trashElement: disposeElementFn,
      __resolveExpression: resolveExpression,
      __reconcileChildren: reconcileChildrenFn,
      __clearChildComponents: cleanChildComponentsFn(componentSelectorById),
      __createStagingElement: makeStagingElementFn,
    };
  };
}
