import { ComponentId, ComponentInstance, PluncAppInstance, ServiceInstance } from "../types";
import { COMPONENT_ELEMENT_ATTR, PLUNC_ID_ATTRIBUTE } from "./attributesList";
import { createLineage } from "./createLineage";
import { PluncApp } from "./createPluncApp";
import { createHTMLDocumentImplementation } from "./documentHelpers";
import { makeComponentIdGenerator } from "./makeComponentId";
import { nameAliasParser } from "./nameAliasParser";
import { PluncAttributeKeyFormatter } from "./pluncAttributeKeyFormatter";
import { PluncAttributeValueGetter } from "./pluncAttributeValueGetter";
import { ReferenceIdAttacher } from "./referenceIdAttacher";
import { TemplateHtmlGetter } from "./templateHtmlGetter";

export type ParentComponentBuilder = (
  document: Document,
  componentId: ComponentId,
  componentElement: Element,
  lineage: ReturnType<typeof createLineage>
) => Promise<string>

export function createParentComponentBuilder(
  getPluncAttrValue: PluncAttributeValueGetter,
  nameAliasParserFn: typeof nameAliasParser,
  templateGetter: TemplateHtmlGetter,
  createHTMLDocumentImplementationFn: typeof createHTMLDocumentImplementation,
  attachReferenceId: ReferenceIdAttacher
): ParentComponentBuilder {
  return async function(
    document: Document,
    componentId: ComponentId,
    componentElement: Element,
    lineage: ReturnType<typeof createLineage>
  ): Promise<string> {
    const mayHaveAliasName = getPluncAttrValue(componentElement, COMPONENT_ELEMENT_ATTR)
    if (mayHaveAliasName === null) return ''
    const componentName = nameAliasParserFn(mayHaveAliasName)

    // Get component template 
    const templateHtml = templateGetter(document)(componentName.name)

    // Component implementation element
    const implementationElement = createHTMLDocumentImplementationFn('')
    implementationElement.body.innerHTML = templateHtml

    // Attach the component id to the implementation element
    attachReferenceId(componentId, implementationElement)

    return implementationElement.body.innerHTML.trim()
  }
  
}

async function buildChildren(
  parentComponentId: ComponentId,
  parentComponentImplementation: Document,
  lineage: ReturnType<typeof createLineage>,
  pluncInstance: PluncApp,
  pluncAttributeKeyFormatter: PluncAttributeKeyFormatter,
  pluncAttributeValueGetter: PluncAttributeValueGetter,
  generateComponentId: ReturnType<typeof makeComponentIdGenerator>
) {
  let compiled = ''
  const selector = pluncAttributeKeyFormatter(COMPONENT_ELEMENT_ATTR)
  const children = parentComponentImplementation.querySelectorAll(`[${selector}]`)
  for (let i = 0; i < children.length; i++) {
    const child = children[i]

    // Only process elements that have the component attribute
    const nameMayHaveAlias = pluncAttributeValueGetter(child, COMPONENT_ELEMENT_ATTR)
    if (nameMayHaveAlias === null) continue

    const childId = generateComponentId(i, parentComponentId)
    child.setAttribute(pluncAttributeKeyFormatter(PLUNC_ID_ATTRIBUTE), childId)
    lineage.begat(childId, parentComponentId)

    let childComponentObject: ComponentInstance
    const existing = pluncInstance.instances.getInstance(childId)
    if (existing !== null) {
      assertInstanceIsComponentInstance(existing)
      childComponentObject = existing
    }

  }
}

function assertInstanceIsComponentInstance(instance: ComponentInstance | ServiceInstance | undefined): asserts instance is ComponentInstance {
  if (instance === undefined) {
    throw new Error('Instance not found')
  }
  if (!('id' in instance) || !('name' in instance)) {
    throw new Error('Instance is not a component instance')
  }
  if (instance.alias !== null && typeof instance.alias !== 'string') {
    throw new Error('Instance alias must be a string or null')
  }
}