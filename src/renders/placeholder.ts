import { RenderContext } from "../utils/renderHelpers";

export function renderPlaceholders(context: RenderContext) {
  const regularExp = /(?<=\{{).+?(?=\}})/g;
  if (
    context.element instanceof Document ||
    context.element instanceof DocumentFragment
  ) {
    throw new Error(
      "Cannot render placeholders on Document or DocumentFragment object"
    );
  }
  let template = context.element.innerHTML;
  context.element.innerHTML = "";

  // Match all regexp occurrences in the template
  const matches = template.match(regularExp);

  // When there are no matches, do nothing
}
