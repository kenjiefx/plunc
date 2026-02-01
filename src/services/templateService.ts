import { TemplatesMap } from "../types";
import { GLOBAL_DIRECTIVE_FOR_TEMPLATE_NAME } from "./pluncAttribute";

export function collectTemplateElementsInnerHtml(
  contextElement: HTMLElement,
): TemplatesMap {
  const templatesMap: TemplatesMap = new Map();
  const templateElements = Array.from(
    contextElement.querySelectorAll("template"),
  );
  const pluncAttr = `${GLOBAL_DIRECTIVE_FOR_TEMPLATE_NAME}`;
  for (const templElement of templateElements) {
    const name = templElement.getAttribute(pluncAttr);
    if (name) {
      templatesMap.set(name, templElement.innerHTML);
    }
  }
  return templatesMap;
}
