/**
 * Creates a new HTML document with the specified name.
 * @param name 
 * @returns 
 */
export function createHTMLDocumentImplementation(name: string) {
  return document.implementation.createHTMLDocument(name)
}

/**
 * Queries the document for all elements matching the specified selector.
 * @param selector 
 * @returns 
 */
export function documentQuerySelectorAll(selector: string) {
  return document.querySelectorAll(selector)
}

/**
 * Queries the document for the first element matching the specified selector.
 * @param selector 
 * @returns 
 */
export function documentQuerySelector(selector: string) {
  return document.querySelector(selector)
}

/**
 * Creates a new element in the document with the specified tag name.
 * @param tagName 
 * @returns 
 */
export function documentcreateElement(tagName: string) {
  return document.createElement(tagName)
}

export function createDocumentTextNode(text: string) {
  return document.createTextNode(text)
}