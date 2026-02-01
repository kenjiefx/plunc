import { CreatePluncAppInternalRepresentationFunction } from "./contracts/app";
import { PluncAttributeKeyFormatter } from "./contracts/attributes";
import { BlockSelectorFactory } from "./contracts/blocks";
import {
  ComponentIdGenerator,
  ComponentInternalRepresentationFactory,
  ComponentProxyFactory,
} from "./contracts/components";
import {
  ChildComponentCleaner,
  CommitStagingElementToFunction,
  ElementDisposer,
  ElementLocker,
  ElementSelector,
  ElementSelectorByComponentId,
  ElementsSelector,
  ElementsSelectorWithPluncAttribute,
  EventLocker,
  GetStagingElementInnerHTMLFunction,
  IsElementLockedChecker,
  IsElementLockedToEvent,
  PluncAttributeValueGetter,
  PluncAttributeValueSetter,
  SetStagingElementInnerHtmlFunction,
  StagingElementFactory,
} from "./contracts/elements";
import {
  AddToLibraryFunction,
  CreateLibraryFunction,
  GetComponentHandlerFromLibraryFunction,
  GetFactoryHandlerFromLibraryFunction,
  GetHelperHandlerFromLibraryFunction,
  GetServiceHandlerFromLibraryFunction,
} from "./contracts/library";
import {
  AddParentChildRecordFunction,
  CreateComponentFamilyTreeFunction,
  GetComponentAncestorsFunction,
  GetComponentChildrenFunction,
  GetComponentParentFunction,
  GetComponentSiblingsFunction,
} from "./contracts/lineage";
import {
  AddComponentToRegistryFunction,
  AddServiceToRegistryFunction,
  CreateRegistryFunction,
  GetAllComponentsFromRegistryFunction,
  GetComponentFromRegistryByIdFunction,
  GetComponentsFromRegistryByIdsFunction,
  GetServiceFromRegistryByIdFunction,
  GetServicesFromRegistryByIdsFunction,
} from "./contracts/registry";
import { AliasNotationParser } from "./services/aliasNotation";
import { composeBlockElementSelector } from "./services/blockService";
import { composeComponentProxyFactory } from "./services/componentProxy";
import {
  composeComponentIdGenerator,
  composeComponentSelectorById,
  createComponentInternalRepresentationFactory,
} from "./services/componentService";
import { resolveConfiguration } from "./services/configuration";
import {
  selectAllElements,
  composeChildComponentCleaner,
  composeElementSelectorsWithPluncAttribute,
  composePluncAttributeValueGetter,
  composePluncAttributeValueSetter,
} from "./services/elementService";
import { resolvePluncExpression } from "./services/expressionResolver";
import {
  composeElementLocker,
  composeEventLocker,
  composeIsElementLockedChecker,
  composeIsEventLockChecker,
} from "./services/lockService";
import { composePluncAttributeKeyFormatter } from "./services/pluncAttribute";
import {
  ComponentId,
  ComponentInternalRepresentation,
  FactoryHandlerFunction,
  HandlerFunction,
  HelperHandlerFunction,
  PluncAppConfiguration,
  PluncAppInternalRepresentation,
  ServiceExternalAPI,
  ServiceName,
} from "./types";

export type PluncAppContainer = {
  __getAppRepresentationInstance: () => PluncAppInternalRepresentation;

  // Library related methods
  __addToLibrary: (
    name: string,
    type: "component" | "service" | "factory" | "helper",
    handler: HandlerFunction<any, any>,
  ) => void;
  __getServiceHandler: (name: string) => HandlerFunction<any, any> | null;
  __getComponentHandler: (name: string) => HandlerFunction<any, any> | null;
  __getFactoryHandler: (name: string) => FactoryHandlerFunction<any> | null;
  __getHelperHandler: (name: string) => HelperHandlerFunction<any, any> | null;

  // Component-tree related methods
  __addRecordToLineage: (parent: ComponentId, child: ComponentId) => void;
  __lookupLineage: (child: ComponentId) => Array<ComponentId>;
  __whoAreTheChildren: (parent: ComponentId) => Array<ComponentId>;
  __whoIsTheParent: (child: ComponentId) => ComponentId | null;
  __whoAreTheSiblings: (child: ComponentId) => Array<ComponentId>;

  // Registry related methods
  __addComponentToRegistry: (
    id: ComponentId,
    component: ComponentInternalRepresentation,
  ) => void;
  __getComponentFromRegistryById: (
    id: ComponentId,
  ) => ComponentInternalRepresentation | null;
  __getComponentsFromRegistryByIds: (
    ids: Array<ComponentId>,
  ) => ComponentInternalRepresentation[];
  __getAllComponentsFromRegistry: () => Array<ComponentInternalRepresentation>;
  __addServiceToRegistry: (
    name: ServiceName,
    service: ServiceExternalAPI,
  ) => void;
  __getServiceFromRegistryById: (
    name: ServiceName,
  ) => ServiceExternalAPI | null;
  __getServicesFromRegistryByIds: (
    ids: Array<ServiceName>,
  ) => ServiceExternalAPI[];

  // Attribute formatter, setter, getter
  __pluncAttributeKeyFormatter: PluncAttributeKeyFormatter;
  __pluncAttributeValueGetter: PluncAttributeValueGetter;
  __pluncAttributeValueSetter: PluncAttributeValueSetter;

  // Misc utilities
  __aliasNotationParser: AliasNotationParser;

  // Component-related utilities
  __generateComponentId: ComponentIdGenerator;

  // Element selection and manipulation utilities
  __querySelectElement: ElementSelector;
  __querySelectAllElements: ElementsSelector;
  __querySelectComponentById: ElementSelectorByComponentId;
  __querySelectAllByPluncAttribute: ElementsSelectorWithPluncAttribute;
  __lockElement: ElementLocker;
  __isElementLocked: IsElementLockedChecker;
  __lockElementToEvent: EventLocker;
  __isElementLockedToEvent: IsElementLockedToEvent;
  __trashElement: ElementDisposer;
  __clearChildComponents: ChildComponentCleaner;

  // Block-related utilities
  __createBlockSelector: BlockSelectorFactory;

  // Component creation and management utilities
  __createComponentInternalRepresentation: ComponentInternalRepresentationFactory;
  __createComponentProxy: ComponentProxyFactory;

  __resolveExpression: (
    dataCtx: { [key: string]: unknown },
    expression: string,
  ) => unknown;

  // Staging element-related utilities
  __createStagingElement: StagingElementFactory;
  __setStagingElementInnerHtml: SetStagingElementInnerHtmlFunction;
  __getStagingElementInnerHtml: GetStagingElementInnerHTMLFunction;
  __commitStagingElementTo: CommitStagingElementToFunction;
};

export function composePluncAppContainerFactory(
  createAppRepresentationInstance: CreatePluncAppInternalRepresentationFunction,
  createRegistryFn: CreateRegistryFunction,
  addComponentToRegistryFn: AddComponentToRegistryFunction,
  getComponentByIdFromRegistryFn: GetComponentFromRegistryByIdFunction,
  getComponentsByIdFromRegistryFn: GetComponentsFromRegistryByIdsFunction,
  getAllComponentsFromRegistryFn: GetAllComponentsFromRegistryFunction,
  addServiceToRegistryFn: AddServiceToRegistryFunction,
  getServiceByIdFromRegistryFn: GetServiceFromRegistryByIdFunction,
  getServicesByIdFromRegistryFn: GetServicesFromRegistryByIdsFunction,
  createLibraryFn: CreateLibraryFunction,
  addToLibraryFn: AddToLibraryFunction,
  getServiceHandlerFn: GetServiceHandlerFromLibraryFunction,
  getComponentHandlerFn: GetComponentHandlerFromLibraryFunction,
  getFactoryHandlerFn: GetFactoryHandlerFromLibraryFunction,
  getHelperHandlerFn: GetHelperHandlerFromLibraryFunction,
  createLineageFn: CreateComponentFamilyTreeFunction,
  addParentChildRecordFn: AddParentChildRecordFunction,
  getComponentAncestorsFn: GetComponentAncestorsFunction,
  getComponentChildrenFn: GetComponentChildrenFunction,
  getComponentParentFn: GetComponentParentFunction,
  getComponentSiblingsFn: GetComponentSiblingsFunction,
  composePluncAttributeKeyFormatterFn: typeof composePluncAttributeKeyFormatter,
  composePluncAttributeKeyGetterFn: typeof composePluncAttributeValueGetter,
  composePluncAttributeKeySetterFn: typeof composePluncAttributeValueSetter,
  aliasNotationParserFn: AliasNotationParser,
  composeComponentIdGeneratorFn: typeof composeComponentIdGenerator,
  selectElementFn: ElementSelector,
  selectAllElementsFn: typeof selectAllElements,
  composeComponentSelectorByIdFn: typeof composeComponentSelectorById,
  composeElementSelectorsWithPluncAttributeFn: typeof composeElementSelectorsWithPluncAttribute,
  composeElementLockerFn: typeof composeElementLocker,
  composeIsElementLockedCheckerFn: typeof composeIsElementLockedChecker,
  composeIsEventLockCheckerFn: typeof composeIsEventLockChecker,
  composeEventLockerFn: typeof composeEventLocker,
  disposeElementFn: ElementDisposer,
  composeChildComponentCleanerFn: typeof composeChildComponentCleaner,
  composeBlockElementSelectorFn: typeof composeBlockElementSelector,
  createComponentInternalRepresentationFactoryFn: typeof createComponentInternalRepresentationFactory,
  composeComponentProxyFactoryFn: typeof composeComponentProxyFactory,
  pluncExpressionResolverFn: typeof resolvePluncExpression,
  createStagingElementFn: StagingElementFactory,
  setStagingElementInnerHtmlFn: SetStagingElementInnerHtmlFunction,
  getStagingElementInnerHtmlFn: GetStagingElementInnerHTMLFunction,
  commitStagingElementToFn: CommitStagingElementToFunction,
) {
  return function createPluncAppContainer(
    instanceId: number,
    applicationName: string,
    configuration: PluncAppConfiguration | null = null,
  ): PluncAppContainer {
    const requiredConfiguration = resolveConfiguration(configuration);
    const registry = createRegistryFn();
    const library = createLibraryFn();
    const lineage = createLineageFn();
    const appRepresentation = createAppRepresentationInstance(
      instanceId,
      applicationName,
      requiredConfiguration,
      library,
      registry,
    );
    const pluncAttributeKeyFormatter = composePluncAttributeKeyFormatterFn(
      requiredConfiguration,
    );
    const pluncAttributeValueGetter = composePluncAttributeKeyGetterFn(
      pluncAttributeKeyFormatter,
    );
    const pluncAttributeValueSetter = composePluncAttributeKeySetterFn(
      pluncAttributeKeyFormatter,
    );
    const blockSelectorFactory = composeBlockElementSelectorFn(
      pluncAttributeKeyFormatter,
      selectAllElementsFn,
    );
    const componentFactory = createComponentInternalRepresentationFactoryFn(
      aliasNotationParserFn,
    );
    const selectComponentById = composeComponentSelectorByIdFn(
      pluncAttributeKeyFormatter,
      selectElementFn,
    );
    const componentProxyFactory = composeComponentProxyFactoryFn();
    return {
      __getAppRepresentationInstance: () => appRepresentation,
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
      __addComponentToRegistry: function (
        id: ComponentId,
        component: ComponentInternalRepresentation,
      ) {
        addComponentToRegistryFn(registry, id, component);
      },
      __getComponentFromRegistryById: function (id: ComponentId) {
        return getComponentByIdFromRegistryFn(registry, id);
      },
      __getComponentsFromRegistryByIds: function (ids: Array<ComponentId>) {
        return getComponentsByIdFromRegistryFn(registry, ids);
      },
      __getAllComponentsFromRegistry: function () {
        return getAllComponentsFromRegistryFn(registry);
      },
      __addServiceToRegistry: function (
        name: ServiceName,
        service: ServiceExternalAPI,
      ) {
        addServiceToRegistryFn(registry, name, service);
      },
      __getServiceFromRegistryById: function (name: ServiceName) {
        return getServiceByIdFromRegistryFn(registry, name);
      },
      __getServicesFromRegistryByIds: function (ids: Array<ServiceName>) {
        return getServicesByIdFromRegistryFn(registry, ids);
      },
      __addRecordToLineage: function (parent: ComponentId, child: ComponentId) {
        addParentChildRecordFn(lineage, parent, child);
      },
      __lookupLineage: function (child: ComponentId) {
        return getComponentAncestorsFn(lineage, child);
      },
      __whoAreTheChildren: function (parent: ComponentId) {
        return getComponentChildrenFn(lineage, parent);
      },
      __whoIsTheParent: function (child: ComponentId) {
        return getComponentParentFn(lineage, child);
      },
      __whoAreTheSiblings: function (child: ComponentId) {
        return getComponentSiblingsFn(lineage, child);
      },
      __pluncAttributeKeyFormatter: pluncAttributeKeyFormatter,
      __pluncAttributeValueGetter: pluncAttributeValueGetter,
      __pluncAttributeValueSetter: pluncAttributeValueSetter,
      __aliasNotationParser: aliasNotationParserFn,
      __generateComponentId: composeComponentIdGeneratorFn(appRepresentation),
      __querySelectElement: selectElementFn,
      __querySelectAllElements: selectAllElementsFn,
      __querySelectComponentById: selectComponentById,
      __querySelectAllByPluncAttribute:
        composeElementSelectorsWithPluncAttributeFn(
          selectAllElementsFn,
          pluncAttributeKeyFormatter,
        ),
      __lockElement: composeElementLockerFn(pluncAttributeKeyFormatter),
      __isElementLocked: composeIsElementLockedCheckerFn(
        pluncAttributeKeyFormatter,
      ),
      __lockElementToEvent: composeEventLockerFn(pluncAttributeKeyFormatter),
      __isElementLockedToEvent: composeIsEventLockCheckerFn(
        pluncAttributeKeyFormatter,
      ),
      __trashElement: disposeElementFn,
      __clearChildComponents:
        composeChildComponentCleanerFn(selectComponentById),
      __createBlockSelector: blockSelectorFactory,
      __createComponentInternalRepresentation: componentFactory,
      __createComponentProxy: componentProxyFactory,
      __resolveExpression: pluncExpressionResolverFn,
      __createStagingElement: createStagingElementFn,
      __setStagingElementInnerHtml: setStagingElementInnerHtmlFn,
      __getStagingElementInnerHtml: getStagingElementInnerHtmlFn,
      __commitStagingElementTo: commitStagingElementToFn,
    };
  };
}
