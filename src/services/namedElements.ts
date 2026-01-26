import { PluncAppContext } from "./contextBinder";
import { ElementsSelector } from "./elementService";
import { BLOCK_ELEMENT_ATTR, ELEMENT_REFERENCE_ATTR } from "./pluncAttribute";

export type ReferenceAttacher = (
  referenceId: string,
  component: HTMLElement,
) => void;

export function composeReferenceAttacher(
  appCtx: PluncAppContext,
  elementsSelector: ElementsSelector,
) {
  return function attachReferenceToNamedElements(
    referenceId: string,
    component: HTMLElement,
  ) {
    [BLOCK_ELEMENT_ATTR].forEach((attribute) => {
      const namedElementAttribute =
        appCtx.__pluncAttributeKeyFormatter(attribute);
      const attributableElements = elementsSelector(
        component,
        `[${namedElementAttribute}]`,
      );
      attributableElements.forEach((element) => {
        appCtx.__pluncAttributeValueSetter(
          element,
          ELEMENT_REFERENCE_ATTR,
          referenceId,
        );
      });
    });
  };
}
