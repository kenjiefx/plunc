import { PluncAppContainer } from "../container";
import { PluncAttributeKeyFormatter } from "../contracts/attributes";
import {
  ComponentIdGenerator,
  ComponentReferenceAttacher,
} from "../contracts/components";
import {
  ElementSelector,
  ElementsSelector,
  StagingElementFactory,
} from "../contracts/elements";
import {
  ComponentExposedAPIProxy,
  ComponentId,
  ComponentInternalRepresentation,
  PluncAppInternalRepresentation,
  TemplatesMap,
} from "../types";
import { AliasNotationParser } from "./aliasNotation";
import {
  COMPONENT_ELEMENT_DIRECTIVE,
  COMPONENT_ID_DIRECTIVE,
} from "./pluncAttribute";

export function createComponentInternalRepresentationFactory(
  aliasParser: AliasNotationParser,
) {
  return function createComponentInternalRepresentation(
    id: ComponentId,
    nameThatMayHaveAlias: string,
  ): ComponentInternalRepresentation {
    const { name, alias } = aliasParser(nameThatMayHaveAlias);
    let proxy: ComponentExposedAPIProxy | null = null;
    let template: string = `<!-- Component ${id} Template -->`;
    const scope: { [key: string]: any } = {};
    function __setProxy(p: ComponentExposedAPIProxy): void {
      proxy = p;
    }
    function __getProxy(): ComponentExposedAPIProxy | null {
      return proxy;
    }
    function __setTemplate(t: string): void {
      template = t;
    }
    function __getTemplate(): string {
      return template;
    }
    return {
      id,
      name,
      alias,
      scope,
      __setProxy,
      __getProxy,
      __setTemplate,
      __getTemplate,
    };
  };
}

export function composeComponentIdGenerator(
  pluncApp: PluncAppInternalRepresentation,
) {
  return function generateComponentId(
    childIteration: number,
    parentComponentId: ComponentId,
  ): ComponentId {
    if (parentComponentId !== "") {
      return `${parentComponentId}.${childIteration.toString()}` as ComponentId;
    }
    return `${pluncApp.id.toString()}.${childIteration.toString()}` as ComponentId;
  };
}

export type RenderContext = {
  createStagingElementFn: StagingElementFactory;
};

export function composeComponentRenderer(
  appCtx: PluncAppContainer,
  templatesMap: TemplatesMap,
  elementsSelector: ElementsSelector,
  generateComponentId: ComponentIdGenerator,
  attachReferenceToNamedElementsFn: ComponentReferenceAttacher,
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
      COMPONENT_ID_DIRECTIVE,
      componentId,
    );

    // Record the lineage of the component
    appCtx.__addRecordToLineage(parentComponentId, componentId);

    // Create or get the component object
    const componentAlias = getComponentAlias(appCtx, componentWrapperElement);
    const componentInternalRepresentation =
      createOrGetComponentInternalRepresentation(
        componentId,
        componentName,
        componentAlias,
        appCtx,
      );

    // Check for circular dependencies
    assertNoCircularDependency(appCtx, componentInternalRepresentation);

    // Add the component object to the registry
    appCtx.__addComponentToRegistry(
      componentId,
      componentInternalRepresentation,
    );

    const componentTemplate = templatesMap.get(componentName);
    if (componentTemplate === undefined) {
      throw new Error(`Template not found for component: ${componentName}`);
    }
    componentWrapperElement.innerHTML = componentTemplate;
    attachReferenceToNamedElementsFn(componentId, componentWrapperElement);
    renderComponentsOfParent(componentWrapperElement, componentId);
    componentInternalRepresentation.__setTemplate(
      componentWrapperElement.innerHTML,
    );
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
  appCtx: PluncAppContainer,
  elementsSelector: ElementsSelector,
) {
  const componentAttributeKey = appCtx.__pluncAttributeKeyFormatter(
    COMPONENT_ELEMENT_DIRECTIVE,
  );
  return elementsSelector(target, `[${componentAttributeKey}]`);
}

export function composeComponentSelectorById(
  pluncAttributeKeyFormatter: PluncAttributeKeyFormatter,
  elementSelector: ElementSelector,
) {
  return function selectComponentById(
    selectContext: HTMLElement,
    componentId: ComponentId,
  ) {
    const attributeKey = pluncAttributeKeyFormatter(COMPONENT_ID_DIRECTIVE);
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
  appCtx: PluncAppContainer,
  componentElement: HTMLElement,
) {
  const componentNameThatMayHaveAlias = getComponentNameThatMayHaveAlias(
    appCtx,
    componentElement,
  );
  return appCtx.__aliasNotationParser(componentNameThatMayHaveAlias).name;
}

function getComponentAlias(
  appCtx: PluncAppContainer,
  componentElement: HTMLElement,
) {
  const componentNameThatMayHaveAlias = getComponentNameThatMayHaveAlias(
    appCtx,
    componentElement,
  );
  return appCtx.__aliasNotationParser(componentNameThatMayHaveAlias).alias;
}

function getComponentNameThatMayHaveAlias(
  appCtx: PluncAppContainer,
  componentElement: HTMLElement,
) {
  const componentNameThatMayHaveAlias = appCtx.__pluncAttributeValueGetter(
    componentElement,
    COMPONENT_ELEMENT_DIRECTIVE,
  );
  if (!componentNameThatMayHaveAlias) {
    throw new Error(
      `Component element is missing the ${COMPONENT_ELEMENT_DIRECTIVE} attribute.`,
    );
  }
  return componentNameThatMayHaveAlias;
}

export function assertNoCircularDependency(
  appCtx: PluncAppContainer,
  componentInternalRepresentation: ComponentInternalRepresentation,
) {
  const name = componentInternalRepresentation.name;
  const idsOfParents = appCtx.__lookupLineage(
    componentInternalRepresentation.id,
  );
  const parentNames = appCtx.__getComponentsFromRegistryByIds(idsOfParents);
  parentNames.forEach((parent) => {
    if (parent && "name" in parent && parent.name === name) {
      throw new Error(`Circular dependency detected for component: ${name}`);
    }
  });
}

export function createOrGetComponentInternalRepresentation(
  componentId: ComponentId,
  name: string,
  alias: string | null,
  appCtx: PluncAppContainer,
): ComponentInternalRepresentation {
  const existingComponent = appCtx.__getComponentFromRegistryById(componentId);
  if (existingComponent !== null) {
    return existingComponent;
  }
  return appCtx.__createComponentInternalRepresentation(
    componentId,
    alias ? `${name}:${alias}` : name,
  );
}
