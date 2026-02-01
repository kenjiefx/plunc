import { PluncAppContainer } from "../container";
import {
  MissingBlockElementInComponentError,
  MissingLiveComponentElementError,
  PluncError,
  UsingPatchAPIOutsideAppReadyError,
} from "../errors/pluncError";
import { composeDirectivesProcessor } from "../services/directivesProcessor";
import {
  BLOCK_ELEMENT_DIRECTIVE,
  COMPONENT_REFERENCE_DIRECTIVE,
} from "../services/pluncAttribute";
import { ComponentInternalRepresentation } from "../types";

export function composePatchAPI(
  appCtx: PluncAppContainer,
  componentObject: ComponentInternalRepresentation,
) {
  return async function $patch(blockName: string | null = null) {
    if (!appCtx.__getAppRepresentationInstance().isReady()) {
      throw new PluncError<UsingPatchAPIOutsideAppReadyError>("ERR10");
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
    const { targetType, patchTargetNodes } = getPatchTargetNodesAndType(
      blockName,
      liveComponentElement,
      componentObject,
      appCtx,
    );

    for (const patchTargetNode of patchTargetNodes) {
      const elementBindTo = patchTargetNode;
      if (elementBindTo === null) continue;
      let elementBindFrom = appCtx.__createStagingElement();

      if (targetType === "COMPONENT") {
        appCtx.__setStagingElementInnerHtml(
          elementBindFrom,
          componentObject.getTemplate(),
        );
      } else {
        if (blockName === null) continue;
        const blockTemplate = getBlockTemplate(
          appCtx,
          componentObject,
          blockName,
        );
        appCtx.__setStagingElementInnerHtml(elementBindFrom, blockTemplate);
      }

      const processDirectives = composeDirectivesProcessor(appCtx);
      processDirectives(elementBindFrom, componentObject.scope, false);

      // Now reconcile the changes from elementBindFrom to elementBindTo
      elementBindTo.innerHTML = "";
      appCtx.__commitStagingElementTo(elementBindFrom, elementBindTo);
    }
  };
}

function getPatchTargetNodesAndType(
  blockName: string | null,
  liveComponentElement: HTMLElement,
  componentObject: ComponentInternalRepresentation,
  appCtx: PluncAppContainer,
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

export function getBlockTemplate(
  appCtx: PluncAppContainer,
  componentObject: ComponentInternalRepresentation,
  blockName: string,
) {
  const stagingElement = appCtx.__createStagingElement(
    componentObject.getTemplate(),
  );
  const blockDirective = appCtx.__pluncAttributeKeyFormatter(
    BLOCK_ELEMENT_DIRECTIVE,
  );
  const referenceDirective = appCtx.__pluncAttributeKeyFormatter(
    COMPONENT_REFERENCE_DIRECTIVE,
  );
  const specificBlockSelector = `[${blockDirective}="${blockName}"][${referenceDirective}="${componentObject.id}"]`;
  const blockElement = appCtx.__querySelectAllElements(
    stagingElement,
    specificBlockSelector,
  );
  if (blockElement.length === 0) {
    throw new PluncError<MissingBlockElementInComponentError>("ERR11");
  }
  return blockElement[0].innerHTML;
}
