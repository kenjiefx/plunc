import { ComponentId } from "../types";
import { ElementSelectorByComponentId } from "./elementService";

/**
 * Replaces the children of a target element with the children
 * of a source element, reusing existing nodes when possible.
 *
 * Event listeners are preserved because nodes are reused,
 * not recreated or moved unnecessarily.
 */
export function reconcileChildren(
  source: HTMLElement | null,
  target: HTMLElement,
) {
  if (source === null) return;
  while (source.childNodes.length > 0) {
    target.appendChild(source.childNodes[0]);
  }
}

/**
 * Indexes child elements by component ID without
 * removing them from the DOM.
 */
export function indexChildrenByComponentId(
  parent: HTMLElement,
  componentIds: ComponentId[],
  findByComponentId: ElementSelectorByComponentId,
) {
  const map = new Map<ComponentId, HTMLElement>();
  for (const id of componentIds) {
    const element = findByComponentId(parent, id);
    if (element) {
      map.set(id, element);
    }
  }
  return map;
}

/**
 * Reconciles the DOM structure of a target scope
 * against a source scope while preserving:
 * - event listeners
 * - child component identity
 * - DOM stability
 */
export function composeComponentReconciler(
  reconcileChildrenFn: typeof reconcileChildren,
  findByComponentId: ElementSelectorByComponentId,
) {
  return function reconcileScope(
    sourceScope: HTMLElement,
    targetScope: HTMLElement,
    childComponentIds: ComponentId[],
  ) {
    // Preserve references to important children
    // const preservedChildren = indexChildrenByComponentId(
    //   targetScope,
    //   childComponentIds,
    //   findByComponentId,
    // );

    // // Reconcile top-level structure
    // reconcileChildrenFn(sourceScope, targetScope);

    // // Reconcile preserved child subtrees
    // for (const [id, preservedChild] of preservedChildren) {
    //   const newChildLocation = findByComponentId(targetScope, id);

    //   if (newChildLocation && newChildLocation !== preservedChild) {
    //     newChildLocation.replaceWith(preservedChild);
    //   }
    // }
    const TChildRegistry: { [key: ComponentId]: HTMLElement } = {};
    for (let i = 0; i < childComponentIds.length; i++) {
      const childId = childComponentIds[i];
      const tempChildEl = document.implementation.createHTMLDocument().body;
      const actualChildEl = findByComponentId(targetScope, childId);
      if (actualChildEl !== null) {
        reconcileChildren(actualChildEl, tempChildEl);
        TChildRegistry[childId] = tempChildEl;
      }
    }
    targetScope.innerHTML = "";
    reconcileChildren(sourceScope, targetScope);
    for (const childId in TChildRegistry) {
      const actualChildEl = findByComponentId(
        targetScope,
        childId as ComponentId,
      );
      if (actualChildEl === null) continue;
      const tempChildEl = TChildRegistry[childId as ComponentId] as HTMLElement;
      reconcileChildren(tempChildEl, actualChildEl);
    }
  };
}
