import { ComponentObject } from "../entities/component";
import { ElementsSelector } from "./elementService";
import {
  BLOCK_ELEMENT_ATTR,
  ELEMENT_REFERENCE_ATTR,
  PluncAttributeKeyFormatter,
} from "./pluncAttribute";

function createSelectorUsingAttributes(
  name: string,
  componentObject: ComponentObject,
  pluncAttributeKeyFormatter: PluncAttributeKeyFormatter,
) {
  const blockAttributeKey = pluncAttributeKeyFormatter(BLOCK_ELEMENT_ATTR);
  const referenceAttributeKey = pluncAttributeKeyFormatter(
    ELEMENT_REFERENCE_ATTR,
  );
  return `[${blockAttributeKey}="${name}"][${referenceAttributeKey}="${componentObject.id}"]`;
}

export type BlockSelector = (context: HTMLElement) => HTMLElement[];

export type BlockSelectorCreator = (
  name: string,
  componentObject: ComponentObject,
) => BlockSelector;

export function composeBlockElementSelector(
  pluncAttributeKeyFormatter: PluncAttributeKeyFormatter,
  querySelectAllElements: ElementsSelector,
) {
  return function composeSelector(
    name: string,
    componentObject: ComponentObject,
  ) {
    const blockSelector = createSelectorUsingAttributes(
      name,
      componentObject,
      pluncAttributeKeyFormatter,
    );
    return function selectElements(context: HTMLElement): HTMLElement[] {
      return querySelectAllElements(context, blockSelector);
    };
  };
}
