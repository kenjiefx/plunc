import { PluncApp } from "../entities/plunc";
import { ElementSelectorManager } from "../utils/elementSelector";
import {
  PluncAttributeManager,
  REPEAT_ELEMENT_ATTR,
} from "../utils/pluncAttribute";

export function renderRepeats(
  element: HTMLElement,
  pluncApp: PluncApp,
  attributeManager: PluncAttributeManager,
  elementSelector: ElementSelectorManager
) {
  const repeatAttr = attributeManager.create(REPEAT_ELEMENT_ATTR);
  const repeatElements = elementSelector.selectAll(`[${repeatAttr}]`);
  console.log(repeatElements);
}
