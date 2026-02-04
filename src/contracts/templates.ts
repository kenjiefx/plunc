export type TemplatesMap = Map<string, string>;

export type collectTemplateElementsInnerHtmlFunction = (
  contextElement: HTMLElement,
) => TemplatesMap;