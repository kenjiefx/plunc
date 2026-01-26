import { ComponentObject, isComponentObject } from "../entities/component";
import { PluncAppContext } from "../services/contextBinder";
import { ComponentId } from "../types";

export function composeParentAPI(
  appCtx: PluncAppContext,
  componentObject: ComponentObject,
) {
  return function $parent() {
    const parentId = appCtx.__whoIsTheParent(componentObject.id);
    if (parentId === null) return null;
    const parentComponentObject = appCtx.__getFromRegistryById(parentId);
    if (!parentComponentObject) return null;
    if (!isComponentObject(parentComponentObject)) return null;

    const wrapper: { [id: ComponentId]: ComponentObject } = {};
    wrapper[parentId] = parentComponentObject;
    return appCtx.__createComponentProxy(wrapper);
  };
}
