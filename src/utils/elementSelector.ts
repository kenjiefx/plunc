export type ElementSelectorManager = ReturnType<typeof useElementSelector>;

export function useElementSelector(context: Document | HTMLElement) {
  /**
   * Selects an element within the given context using the provided CSS selector.
   * @param context - Document or HTMLElement to search within
   * @param selector - CSS selector string to match the element
   * @returns The first matching HTMLElement or null if no match is found
   */
  function select(selector: string): HTMLElement | null {
    return context.querySelector<HTMLElement>(selector);
  }

  function selectAll(selector: string): HTMLElement[] {
    return Array.from(context.querySelectorAll<HTMLElement>(selector));
  }

  function selectClosest(
    element: HTMLElement,
    selector: string
  ): HTMLElement | null {
    return element.closest<HTMLElement>(selector);
  }

  return {
    select,
    selectAll,
    selectClosest,
  };
}
