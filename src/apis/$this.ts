import { ComponentObject } from "../entities/component";
import { PluncElement } from "../entities/element";
import { PluncAppContext } from "../services/contextBinder";

/**
 * Component API reflects the current component context.
 * @param appCtx
 * @param componentObject
 * @returns
 */
export function composeComponentAPI(
  appCtx: PluncAppContext,
  componentObject: ComponentObject,
) {
  return function $this() {
    return {
      id: componentObject.id,
      name: componentObject.name,
      alias: componentObject.alias,
      element: (): PluncElement | null => {
        if (!appCtx.__getInstance().isReady()) {
          throw new Error(
            `Cannot invoke component.get().element() outside $app.ready`,
          );
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
