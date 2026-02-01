import { PluncAppContainer } from "../container";
import {
  MissingLiveComponentElementError,
  PluncError,
  UsingBlockAPIOutsideAppReadyError,
} from "../errors/pluncError";
import { PluncElement } from "../services/pluncElement";
import { BlockCallback, ComponentInternalRepresentation } from "../types";

export function composeBlockAPI(
  appCtx: PluncAppContainer,
  componentObject: ComponentInternalRepresentation,
) {
  return function $block(name: string, callback: BlockCallback<HTMLElement>) {
    if (!appCtx.__getAppRepresentationInstance().isReady()) {
      throw new PluncError<UsingBlockAPIOutsideAppReadyError>("ERR8");
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
      throw new PluncError<MissingLiveComponentElementError>("ERR9");
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
