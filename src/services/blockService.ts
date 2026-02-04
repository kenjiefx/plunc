import { PluncAttributeKeyFormatter } from "../contracts/attributes";
import { ElementsSelector } from "../contracts/elements";
import { ComponentInternalRepresentation } from "../types";
import {
  BLOCK_ELEMENT_DIRECTIVE,
  COMPONENT_REFERENCE_DIRECTIVE,
} from "./pluncAttribute";

/**
 * Creates selector string for block element using attributes.
 * The selector targets elements with specific block name and component reference.
 */
function createSelectorUsingAttributes(
  name: string,
  componentInternalRepresentation: ComponentInternalRepresentation,
  pluncAttributeKeyFormatter: PluncAttributeKeyFormatter,
) {
  const blockAttributeKey = pluncAttributeKeyFormatter(BLOCK_ELEMENT_DIRECTIVE);
  const referenceAttributeKey = pluncAttributeKeyFormatter(
    COMPONENT_REFERENCE_DIRECTIVE,
  );
  return `[${blockAttributeKey}="${name}"][${referenceAttributeKey}="${componentInternalRepresentation.id}"]`;
}

export function composeBlockElementSelector(
  pluncAttributeKeyFormatter: PluncAttributeKeyFormatter,
  querySelectAllElements: ElementsSelector,
) {
  return function composeSelector(
    blockName: string,
    componentInternalRepresentation: ComponentInternalRepresentation,
  ) {
    const blockSelector = createSelectorUsingAttributes(
      blockName,
      componentInternalRepresentation,
      pluncAttributeKeyFormatter,
    );
    return function selectElements(context: HTMLElement): HTMLElement[] {
      return querySelectAllElements(context, blockSelector);
    };
  };
}
