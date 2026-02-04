/**
 * Wraps comment block within an element.
 * @param element - Element to be disposed
 * @param comment - Comment you'd like to add
 */
export function disposeElement(element: HTMLElement, comment: string) {
  if (null !== element) {
    element.innerHTML = "";
    if (element.parentNode !== null) {
      element.outerHTML =
        "<!-- plunc.js: " + element.outerHTML + " | " + comment + " -->";
    }
  }
}
