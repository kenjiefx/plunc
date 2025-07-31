import { TEMPLATE_NAME_ATTR } from "./attributesList";
import { PluncAttributeFormatter } from "./pluncAttributeFormatter";
import { nameAliasParser } from "./nameAliasParser";

export type TemplateHtmlGetter = (element: Element | Document) => (nameThatMayHaveAlias: string) => string

export function createTemplateHtmlGetter(
  nameAliasParserFn: typeof nameAliasParser,
  pluncAttributeFormatter: PluncAttributeFormatter
) {
  return function (elementOrDocument: Element | Document) {
    return function (
      nameThatMayHaveAlias: string,
    ) {
      const actualName = nameAliasParserFn(nameThatMayHaveAlias).name
      const attribute = pluncAttributeFormatter(TEMPLATE_NAME_ATTR, actualName)
      const selector = `template[${attribute}]`.trim()
      const templateElement = elementOrDocument.querySelectorAll(selector)
      if (templateElement.length === 0) {
        throw new Error(`template with name "${nameThatMayHaveAlias}" not found.`)
      }
      if (templateElement.length > 1) {
        throw new Error(`multiple templates with name "${nameThatMayHaveAlias}" found.`)
      }
      return templateElement[0].innerHTML.trim()
    }
  }
}