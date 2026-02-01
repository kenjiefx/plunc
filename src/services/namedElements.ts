import { PluncAppContainer } from "../container";
import { ElementsSelector } from "../contracts/elements";
import {
  BLOCK_ELEMENT_DIRECTIVE,
  COMPONENT_REFERENCE_DIRECTIVE,
} from "./pluncAttribute";

export function composeReferenceAttacher(
  appCtx: PluncAppContainer,
  elementsSelector: ElementsSelector,
) {
  return function attachReferenceToNamedElements(
    referenceId: string,
    component: HTMLElement,
  ) {
    [BLOCK_ELEMENT_DIRECTIVE].forEach((attribute) => {
      const namedElementAttribute =
        appCtx.__pluncAttributeKeyFormatter(attribute);
      const attributableElements = elementsSelector(
        component,
        `[${namedElementAttribute}]`,
      );
      attributableElements.forEach((element) => {
        appCtx.__pluncAttributeValueSetter(
          element,
          COMPONENT_REFERENCE_DIRECTIVE,
          referenceId,
        );
      });
    });
  };
}
