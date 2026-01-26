import { ComponentId } from "../types";
import { ElementSelectorByComponentId } from "./elementService";

/**
 * Replaces the children of a target element with the children
 * of a source element, reusing existing nodes when possible.
 *
 * Event listeners are preserved because nodes are reused,
 * not recreated or moved unnecessarily.
 */
export function reconcileChildren(source: HTMLElement, target: HTMLElement) {
  const sourceChildren = Array.from(source.childNodes);
  const targetChildren = Array.from(target.childNodes);

  const max = Math.max(sourceChildren.length, targetChildren.length);

  for (let i = 0; i < max; i++) {
    const sourceNode = sourceChildren[i];
    const targetNode = targetChildren[i];

    if (!sourceNode && targetNode) {
      // Remove safely unused target node
      target.removeChild(targetNode);
      continue;
    }

    if (sourceNode && !targetNode) {
      // Clone structure only for missing target node
      target.appendChild(sourceNode.cloneNode(false));
      continue;
    }

    if (
      sourceNode &&
      targetNode &&
      sourceNode.nodeName !== targetNode.nodeName
    ) {
      // Replace different node types
      target.replaceChild(sourceNode.cloneNode(false), targetNode);
    }
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
export function createScopeReconciler(
  reconcileChildrenFn: typeof reconcileChildren,
  findByComponentId: ElementSelectorByComponentId,
) {
  return function reconcileScope(
    sourceScope: HTMLElement,
    targetScope: HTMLElement,
    childComponentIds: ComponentId[],
  ) {
    // Preserve references to important children
    const preservedChildren = indexChildrenByComponentId(
      targetScope,
      childComponentIds,
      findByComponentId,
    );

    // Reconcile top-level structure
    reconcileChildrenFn(sourceScope, targetScope);

    // Reconcile preserved child subtrees
    for (const [id, preservedChild] of preservedChildren) {
      const newChildLocation = findByComponentId(targetScope, id);

      if (newChildLocation && newChildLocation !== preservedChild) {
        newChildLocation.replaceWith(preservedChild);
      }
    }
  };
}
