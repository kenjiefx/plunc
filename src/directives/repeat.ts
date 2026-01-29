import { PluncAppContext } from "../services/contextBinder";
import { REPEAT_ELEMENT_ATTR } from "../services/pluncAttribute";

export function composeRepeatHydrator(appCtx: PluncAppContext) {
  return function hydrate(elementCtx: HTMLElement) {
    // Get elements with the repeat directive
    const repeatAttributeKey =
      appCtx.__pluncAttributeKeyFormatter(REPEAT_ELEMENT_ATTR);
    const repeatElements = appCtx.__querySelectAllElements(
      elementCtx,
      `[${repeatAttributeKey}]`,
    );
  };
  // A repeat hydrator composes multiple instances of element based on an array of data.
}
