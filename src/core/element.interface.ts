/**
 * Selects an element within the given context using the provided CSS selector.
 * @param context - Document or HTMLElement to search within
 * @param selector - CSS selector string to match the element
 */
export type ElementSelector = (
  context: HTMLElement,
  selector: string,
) => HTMLElement | null;

/**
 * Selects all elements within the given context that match the provided CSS selector.
 * @param context
 * @param selector
 */
export type ElementsSelector = (
  context: HTMLElement,
  selector: string,
) => Array<HTMLElement>;
