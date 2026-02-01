import { PluncAppContainer } from "../container";
import {
  PluncError,
  UsingThisAPIOutsideAppReadyError,
} from "../errors/pluncError";
import { PluncElement } from "../services/pluncElement";
import { ComponentInternalRepresentation } from "../types";

/**
 * Component API reflects the current component context.
 * @param appCtx
 * @param componentObject
 * @returns
 */
export function composeComponentAPI(
  appCtx: PluncAppContainer,
  componentObject: ComponentInternalRepresentation,
) {
  return function $this() {
    return {
      id: componentObject.id,
      name: componentObject.name,
      alias: componentObject.alias,
      element: (): PluncElement | null => {
        if (!appCtx.__getAppRepresentationInstance().__isReady()) {
          throw new PluncError<UsingThisAPIOutsideAppReadyError>("ERR12");
        }
        const elementNode = appCtx.__querySelectComponentById(
          // Components are id'd uniquely accross different app instances,
          // so it's safe to query the document body directly.
          document.body,
          componentObject.id,
        );
        if (elementNode === null) {
          return null;
        }
        return new PluncElement(elementNode);
      },
    };
  };
}
