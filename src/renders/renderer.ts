import { ComponentObject } from "../entities/component";
import { PluncApp } from "../entities/plunc";
import { RenderHelpers } from "../utils/renderHelpers";
import { renderRepeats } from "./repeat";

export async function startRendering(
  elementContext: HTMLElement,
  componentObject: ComponentObject,
  pluncAppInstance: PluncApp,
  rh: RenderHelpers
) {
  renderRepeats(
    elementContext,
    componentObject,
    pluncAppInstance,
    rh.createAttr,
    rh.selectAllByAttribute,
    rh.getAttrValue,
    rh.resolveExp,
    rh.dissectRepeatExp,
    rh.calcNumOfRep,
    rh.isIterable,
    rh.createComponentFn,
    rh.createElementFn,
    rh.copyBindElementFn,
    startRendering,
    rh
  );
}
