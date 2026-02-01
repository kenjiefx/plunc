import { ComponentId, StagingHTMLElement } from "../types";
import { PluncAttributeKeyFormatter } from "./attributes";

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

export type GetDocument = () => HTMLDocument;

export type ElementsSelectorWithPluncAttribute = (
  context: HTMLElement,
  pluncAttributeKey: string,
  pluncAttributeValue?: string,
) => Array<HTMLElement>;

/**
 * Function type for getting the value of a Plunc attribute from an element
 * @param element - The HTML element to retrieve the attribute from
 * @param key - The Plunc attribute key
 */
export type PluncAttributeValueGetter = (
  element: HTMLElement,
  key: string,
) => string | null;

export type PluncAttributeValueSetter = (
  element: HTMLElement,
  key: string,
  value: string,
) => void;

/**
 * Function type for getting an element by its component id within a certain context
 */
export type ElementSelectorByComponentId = (
  context: HTMLElement,
  componentId: ComponentId,
) => HTMLElement | null;
/**
 * Function type for cleaning child components within a certain component element
 */
export type ChildComponentCleaner = (
  cElement: HTMLElement,
  childIds: Array<ComponentId>,
) => void;

/**
 * Function type for locking an element. Locking ensures that no further processing will be
 * made to the element. This is vital for cases when there
 * are repeat expressions, preserving the integrity.
 */
export type ElementLocker = (element: HTMLElement) => void;

/**
 * Function type for checking if an element is locked.
 */
export type IsElementLockedChecker = (element: HTMLElement) => boolean;

export type EventLockChecker = (
  element: HTMLElement,
  eventName: string,
) => boolean;

/**
 * Function type for locking an element to a specific event.
 */
export type EventLocker = (element: HTMLElement, eventName: string) => void;

export type IsElementLockedToEvent = (
  element: HTMLElement,
  eventName: string,
) => boolean;

/**
 * Function type for disposing an element by wrapping it in a comment block.
 */
export type ElementDisposer = (element: HTMLElement, comment: string) => void;

/**
 * Creates and returns a staging HTML element.
 * This function utilizes the DOM implementation to create a new HTML document
 * and returns its body element, which can be used as a base element for further
 * manipulations or as a container.
 */
export type StagingElementFactory = (innerHtml?: string) => StagingHTMLElement;

/**
 * Sets the inner HTML of a staging element.
 * @param stagingElement - The staging HTML element
 * @param html - The HTML string to set as inner HTML
 */
export type SetStagingElementInnerHtmlFunction = (
  stagingElement: StagingHTMLElement,
  html: string,
) => void;

/**
 * Gets the inner HTML of a staging element.
 * @param stagingElement - The staging HTML element
 */
export type GetStagingElementInnerHTMLFunction = (
  stagingElement: StagingHTMLElement,
) => string;

/**
 * Commits the content of a staging element to a target HTML element.
 * @param stagingElement - The staging HTML element
 * @param targetElement - The target HTML element to commit content to
 */
export type CommitStagingElementToFunction = (
  stagingElement: StagingHTMLElement,
  targetElement: HTMLElement,
) => void;
