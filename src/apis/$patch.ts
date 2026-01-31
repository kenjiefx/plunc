import { ComponentObject } from "../entities/component";
import { PluncApp } from "../entities/plunc";
import { BlockSelectorCreator } from "../services/blockService";
import {
  ComponentSelectorById,
  composeComponentRenderer,
} from "../services/componentService";
import { PluncAppContext } from "../services/contextBinder";
import { composeDirectivesProcessor } from "../services/directivesProcessor";
import {
  selectAllElements,
  selectLiveAppRootElement,
} from "../services/elementService";
import { composeReferenceAttacher } from "../services/namedElements";
import {
  BLOCK_ELEMENT_ATTR,
  COMPONENT_ID_ATTR,
  ELEMENT_REFERENCE_ATTR,
  STRAWBERRY_ID_ATTR,
} from "../services/pluncAttribute";
import { collectTemplateElements } from "../services/templateService";

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

    for (const patchTargetNode of patchTargetNodes) {
      const elementBindTo = patchTargetNode;
      if (elementBindTo === null) continue;
      let elementBindFrom = appCtx.__createStagingElement();

      if (targetType === "COMPONENT") {
        elementBindFrom.setInnerHtml(componentObject.template);
      } else {
        if (blockName === null) continue;
        const blockTemplate = getBlockTemplate(
          appCtx,
          componentObject,
          blockName,
        );
        elementBindFrom.setInnerHtml(blockTemplate);
      }

      const processDirectives = composeDirectivesProcessor(appCtx);
      processDirectives(
        elementBindFrom.getElement(),
        componentObject.scope,
        false,
      );

      // Now reconcile the changes from elementBindFrom to elementBindTo
      elementBindTo.innerHTML = "";
      elementBindFrom.commitTo(elementBindTo);
    }
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

export function getBlockTemplate(
  appCtx: PluncAppContext,
  componentObject: ComponentObject,
  blockName: string,
) {
  const stagingElement = appCtx.__createStagingElement(
    componentObject.template,
  );
  const blockDirective =
    appCtx.__pluncAttributeKeyFormatter(BLOCK_ELEMENT_ATTR);
  const referenceDirective = appCtx.__pluncAttributeKeyFormatter(
    ELEMENT_REFERENCE_ATTR,
  );
  const specificBlockSelector = `[${blockDirective}="${blockName}"][${referenceDirective}="${componentObject.id}"]`;
  const blockElement = appCtx.__querySelectAllElements(
    stagingElement.getElement(),
    specificBlockSelector,
  );
  if (blockElement.length === 0) {
    throw new Error(
      `Cannot find block element with name "${blockName}" in component "${componentObject.name}".`,
    );
  }
  return blockElement[0].innerHTML;
}
