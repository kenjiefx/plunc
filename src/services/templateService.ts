import { PluncApp } from "../entities/plunc";
import {
  BLOCK_ELEMENT_ATTR,
  GLOBAL_ATTR_FOR_TEMPLATE_NAME,
} from "./pluncAttribute";
import { parseAliasNotation } from "./aliasNotation";
import { TemplatesMap } from "../entities/templates";
import { PluncAppContext } from "./contextBinder";

export function collectTemplateElements(
  contextElement: HTMLElement,
): TemplatesMap {
  const templatesMap: TemplatesMap = new Map();
  const templateElements = Array.from(
    contextElement.querySelectorAll("template"),
  );
  const pluncAttr = `plunc-${GLOBAL_ATTR_FOR_TEMPLATE_NAME}`;
  for (const templElement of templateElements) {
    const name = templElement.getAttribute(pluncAttr);
    if (name) {
      templatesMap.set(name, templElement.innerHTML);
    }
  }
  return templatesMap;
}

export function getBlockTemplate(
  appCtx: PluncAppContext,
  componentName: string,
  blockName: string,
) {
  const attributeWithValue = `plunc-${GLOBAL_ATTR_FOR_TEMPLATE_NAME}="${componentName}"`;
  const templateElement = document.querySelector(
    `template[${attributeWithValue}]`,
  );
  if (templateElement === null) return null;
  const blockAttribute =
    appCtx.__pluncAttributeKeyFormatter(BLOCK_ELEMENT_ATTR);
  const blockElement = templateElement.querySelector(
    `[${blockAttribute}="${blockName}"]`,
  );
  if (blockElement === null) return null;
  return blockElement.innerHTML;
}
