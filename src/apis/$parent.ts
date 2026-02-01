import { PluncAppContainer } from "../container";
import { ComponentId, ComponentInternalRepresentation } from "../types";

export function composeParentAPI(
  appCtx: PluncAppContainer,
  componentObject: ComponentInternalRepresentation,
) {
  return function $parent() {
    const parentId = appCtx.__whoIsTheParent(componentObject.id);
    if (parentId === null) return null;
    const parentComponentObject =
      appCtx.__getComponentFromRegistryById(parentId);
    if (!parentComponentObject) return null;

    const wrapper: { [id: ComponentId]: ComponentInternalRepresentation } = {};
    wrapper[parentId] = parentComponentObject;
    return appCtx.__createComponentProxy(wrapper);
  };
}
