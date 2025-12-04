import { ComponentScope, PluncElementInterface } from "../types";

/**
 * The `PluncElement` class provides a wrapper around the Element object,
 * offering additional abstraction for managing states, scope, and other
 * non-default features.
 */
export class PluncElement implements PluncElementInterface<Element> {
  /**
   * A reference to the element itself.
   * (Shouldn't be minified, as publicly-accessible)
   */
  $element!: Element;

  /**
   * A reference to parent element, wrapped in this `PluncElement` object
   * (Shouldn't be minified, as publicly-accessible)
   */
  $parent!: PluncElement;

  /** The state of the element */
  private state: string | null;

  /** The scope/context this element belongs to */
  private scope!: ComponentScope;

  /**
   * @param element - The Element
   * @param pcount - The number of iteration of parent created
   */
  constructor(element: Element, pcount: null | number = null) {
    this.$element = element;
    this.state = null;
    this.__wrapParent(pcount ?? 1);
  }

  /** Wraps the parent element within `PluncElement` object */
  private __wrapParent(count: number) {
    const parentElement = this.$element.parentElement;
    if (count > 3 || parentElement === null) return;
    this.$parent = new PluncElement(parentElement, count++);
  }

  /** Retrieves the $element */
  get() {
    return this.$element;
  }

  /** Retrieves the state */
  getState(): string | null {
    return this.state;
  }

  setState(state: string) {
    if (state === null) return;
    this.state = state;
  }

  setScope(scope: ComponentScope) {
    this.scope = scope;
  }

  getScope() {
    return this.scope;
  }

  addClass(className: string) {
    this.$element.classList.add(className);
  }

  listClass() {
    return this.$element.className.split(" ");
  }

  removeClass(className: string) {
    this.$element.classList.remove(className);
  }

  toggleClass(className: string) {
    const classes = this.listClass();
    for (var i = 0; i < classes.length; i++) {
      let aclass = classes[i];
      aclass === className
        ? this.removeClass(className)
        : this.addClass(className);
    }
  }
}
