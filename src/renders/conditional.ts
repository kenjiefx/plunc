import {
  IF_ELEMENT_ATTR,
  PluncAttributeFormatter,
} from "../utils/pluncAttribute";
import { RenderContext } from "../utils/renderHelpers";

export function renderConditionals(ctx: RenderContext) {
  // Retrieve all elements with conditional attribute
  const elements = ctx.elementSelector.selectAllByAttribute(
    ctx.element,
    ctx.attributeFormatter.format(IF_ELEMENT_ATTR)
  );

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    // Skip elements that were already processed
    if (ctx.isElementLocked(element, ctx.attributeFormatter)) continue;

    const conditionExpression = ctx.elementSelector.getAttributeValue(
      element,
      ctx.attributeFormatter.format(IF_ELEMENT_ATTR)
    );

    const scope = ctx.componentObject.scope;
    if (scope === null || conditionExpression === null) continue;

    const conditionResult = ctx.resolveExpression(scope, conditionExpression);
    if (typeof conditionResult === "boolean" && !conditionResult) {
      ctx.disposeElement(element, "false");
    }
    ctx.lockElement(element, ctx.attributeFormatter);
  }
}
