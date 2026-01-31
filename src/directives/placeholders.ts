import { PluncAppContext } from "../services/contextBinder";

export function composePlaceholderResolver(appCtx: PluncAppContext) {
  return function resolvePlaceholders(
    elementCtx: HTMLElement,
    dataCtx: Readonly<{ [key: string]: unknown }>,
  ) {
    const regEx = /(?<=\{{).+?(?=\}})/g;
    // We will resolve placeholders regardless of where they are found:
    // in attributes or in text nodes.
    const htmlContent = elementCtx.innerHTML;
    const matchedPlaceholders = htmlContent.match(regEx);
    if (matchedPlaceholders === null) {
      return;
    }
    matchedPlaceholders.forEach((placeholder) => {
      const expression = placeholder.trim();
      let evaluationResult = appCtx.__resolveExpression(dataCtx, expression);
      if (evaluationResult === null || evaluationResult === undefined) {
        evaluationResult = "";
      }
      const placeholderTag = `{{${placeholder}}}`;
      elementCtx.innerHTML = elementCtx.innerHTML.replace(
        placeholderTag,
        String(evaluationResult),
      );
    });
  };
}
