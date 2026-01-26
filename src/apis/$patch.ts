import { ComponentObject } from "../entities/component";
import { BlockSelectorCreator } from "../services/blockService";
import { ComponentSelectorById } from "../services/componentService";
import { PluncAppContext } from "../services/contextBinder";
import {
  selectAllElements,
  selectLiveAppRootElement,
} from "../services/elementService";
import {
  COMPONENT_ID_ATTR,
  STRAWBERRY_ID_ATTR,
} from "../services/pluncAttribute";

export function composePatchAPI(
  appCtx: PluncAppContext,
  componentObject: ComponentObject,
) {
  return async function $patch(blockName: string | null = null) {
    if (!appCtx.__getInstance().isReady()) {
      throw new Error(`cannot use $patch outside $app.ready`);
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
    const { targetType, patchTargetNodes } = getPatchTargetNodesAndType(
      blockName,
      liveComponentElement,
      componentObject,
      appCtx,
    );
  };
}

function getPatchTargetNodesAndType(
  blockName: string | null,
  liveComponentElement: HTMLElement,
  componentObject: ComponentObject,
  appCtx: PluncAppContext,
): {
  targetType: "BLOCK" | "COMPONENT";
  patchTargetNodes: Array<HTMLElement>;
} {
  if (blockName !== null) {
    const selectAllBlockElements = appCtx.__createBlockSelector(
      blockName,
      componentObject,
    );
    const patchTargetNodes = selectAllBlockElements(liveComponentElement);
    return {
      targetType: "BLOCK",
      patchTargetNodes,
    };
  }
  return {
    targetType: "COMPONENT",
    patchTargetNodes: [liveComponentElement],
  };
}
