import { ComponentObject } from "../entities/component";
import { PluncElement } from "../entities/element";
import { BlockSelectorCreator } from "../services/blockService";
import { ComponentSelectorById } from "../services/componentService";
import { PluncAppContext } from "../services/contextBinder";
import { selectAllElements } from "../services/elementService";
import { BlockCallback } from "../types";

export function composeBlockAPI(
  appCtx: PluncAppContext,
  componentObject: ComponentObject,
) {
  return function $block(name: string, callback: BlockCallback<HTMLElement>) {
    if (!appCtx.__getInstance().isReady()) {
      throw new Error(`cannot use $block outside $app.ready`);
    }
    // At this point, the ComponentObject is guaranteed to be fully initialized,
    // and the elements are rendered in the live DOM.
    const liveComponentElement = appCtx.__querySelectComponentById(
      // Components are id'd uniquely accross different app instances,
      // so it's safe to query the document body directly.
      document.body,
      componentObject.id,
    );
    if (!liveComponentElement) {
      throw new Error(
        `Cannot find the live component element for component id: ${componentObject.id}`,
      );
    }
    const selectAllBlockElements = appCtx.__createBlockSelector(
      name,
      componentObject,
    );
    const blockElements = selectAllBlockElements(liveComponentElement);
    if (blockElements.length === 0) {
      callback(null);
      return;
    }
    blockElements.forEach((blockElement) => {
      callback(new PluncElement(blockElement));
    });
  };
}
