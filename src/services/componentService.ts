import {
  ComponentIdGenerator,
  ComponentObject,
  createComponentFactory,
  isComponentObject,
} from "../entities/component";
import { createScope } from "../entities/scope";
import { TemplatesMap } from "../entities/templates";
import { ComponentId } from "../types";
import { PluncAppContext } from "./contextBinder";
import {
  ElementSelector,
  ElementsSelector,
  StagingElementCreator,
} from "./elementService";
import { ReferenceAttacher } from "./namedElements";
import {
  BLOCK_ELEMENT_ATTR,
  COMPONENT_ELEMENT_ATTR,
  COMPONENT_ID_ATTR,
  ELEMENT_REFERENCE_ATTR,
  PluncAttributeKeyFormatter,
} from "./pluncAttribute";

export type RenderContext = {
  createStagingElementFn: StagingElementCreator;
};

export function composeComponentRenderer(
  appCtx: PluncAppContext,
  templatesMap: TemplatesMap,
  elementsSelector: ElementsSelector,
  generateComponentId: ComponentIdGenerator,
  attachReferenceToNamedElementsFn: ReferenceAttacher,
) {
  function renderComponent(
    componentWrapperElement: HTMLElement,
    componentId: ComponentId,
    parentComponentId: ComponentId,
  ) {
    const componentName = getComponentName(appCtx, componentWrapperElement);

    // Set the component ID attribute on the component wrapper element
    appCtx.__pluncAttributeValueSetter(
      componentWrapperElement,
      COMPONENT_ID_ATTR,
      componentId,
    );

    // Record the lineage of the component
    appCtx.__addRecordToLineage(parentComponentId, componentId);

    // Create or get the component object
    const componentAlias = getComponentAlias(appCtx, componentWrapperElement);
    const componentObject = createOrGetComponentObject(
      componentId,
      componentName,
      componentAlias,
      appCtx,
    );

    // Check for circular dependencies
    assertNoCircularDependency(appCtx, componentObject);

    // Add the component object to the registry
    appCtx.__addRecordToRegistry(componentId, componentObject);

    const componentTemplate = templatesMap.get(componentName);
    if (componentTemplate === undefined) {
      throw new Error(`Template not found for component: ${componentName}`);
    }
    componentWrapperElement.innerHTML = componentTemplate;
    attachReferenceToNamedElementsFn(componentId, componentWrapperElement);
    renderComponentsOfParent(componentWrapperElement, componentId);
  }

  function renderComponentsOfParent(
    parentElement: HTMLElement,
    parentComponentId: ComponentId,
  ) {
    // Find all component wrapper elements in the provided element context
    // They are all wrapper element because they do not have content,
    // and they will be populated with content from the templates.
    // Example: `<section plunc-component="MyComponent"></section>`
    const componentWrapperElements = selectAllComponentElementsInTarget(
      parentElement,
      appCtx,
      elementsSelector,
    );

    let componentIterator = 0;
    componentWrapperElements.forEach((componentWrapperElement) => {
      const componentId = generateComponentId(
        componentIterator,
        parentComponentId,
      );
      componentIterator++;
      renderComponent(componentWrapperElement, componentId, parentComponentId);
    });
  }

  return renderComponentsOfParent;
}

/**
 * Selects all component elements within the given target element.
 * @param target
 * @param appCtx
 * @param elementsSelector
 * @returns
 */
function selectAllComponentElementsInTarget(
  target: HTMLElement,
  appCtx: PluncAppContext,
  elementsSelector: ElementsSelector,
) {
  const componentAttributeKey = appCtx.__pluncAttributeKeyFormatter(
    COMPONENT_ELEMENT_ATTR,
  );
  return elementsSelector(target, `[${componentAttributeKey}]`);
}

export type ComponentSelectorById = (
  selectContext: HTMLElement,
  componentId: ComponentId,
) => HTMLElement | null;

export function composeComponentSelectorById(
  pluncAttributeKeyFormatter: PluncAttributeKeyFormatter,
  elementSelector: ElementSelector,
) {
  return function selectComponentById(
    selectContext: HTMLElement,
    componentId: ComponentId,
  ) {
    const attributeKey = pluncAttributeKeyFormatter(COMPONENT_ID_ATTR);
    const selector = `[${attributeKey}="${componentId}"]`;
    return elementSelector(selectContext, selector);
  };
}

/**
 * Gets the component name from the given component element.
 * @param appCtx
 * @param componentElement
 * @returns
 */
function getComponentName(
  appCtx: PluncAppContext,
  componentElement: HTMLElement,
) {
  const componentNameThatMayHaveAlias = getComponentNameThatMayHaveAlias(
    appCtx,
    componentElement,
  );
  return appCtx.__aliasNotationParser(componentNameThatMayHaveAlias).name;
}

function getComponentAlias(
  appCtx: PluncAppContext,
  componentElement: HTMLElement,
) {
  const componentNameThatMayHaveAlias = getComponentNameThatMayHaveAlias(
    appCtx,
    componentElement,
  );
  return appCtx.__aliasNotationParser(componentNameThatMayHaveAlias).alias;
}

function getComponentNameThatMayHaveAlias(
  appCtx: PluncAppContext,
  componentElement: HTMLElement,
) {
  const componentNameThatMayHaveAlias = appCtx.__pluncAttributeValueGetter(
    componentElement,
    COMPONENT_ELEMENT_ATTR,
  );
  if (!componentNameThatMayHaveAlias) {
    throw new Error(
      `Component element is missing the ${COMPONENT_ELEMENT_ATTR} attribute.`,
    );
  }
  return componentNameThatMayHaveAlias;
}

export function assertNoCircularDependency(
  appCtx: PluncAppContext,
  component: ComponentObject,
) {
  const name = component.name;
  const idsOfParents = appCtx.__lookupLineage(component.id);
  const parentNames = appCtx.__getFromRegistryByIds(idsOfParents);
  parentNames.forEach((parent) => {
    if (parent && "name" in parent && parent.name === name) {
      throw new Error(`Circular dependency detected for component: ${name}`);
    }
  });
}

export function createOrGetComponentObject(
  componentId: ComponentId,
  name: string,
  alias: string | null,
  appCtx: PluncAppContext,
): ComponentObject {
  const existingComponent = appCtx.__getFromRegistryById(componentId);
  if (existingComponent && isComponentObject(existingComponent)) {
    return existingComponent;
  }
  return appCtx.__createComponentObject(
    componentId,
    alias ? `${name}:${alias}` : name,
  );
}
