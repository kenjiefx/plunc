import { PluncElementInterface } from "../types"
import { Scope } from "./scope"

/**
 * An object that represents and wraps a DOM element in the Plunc library.
 */
export class PluncElement implements PluncElementInterface<Element> {
  $element: Element
  $parent: PluncElementInterface<Element> | null
  private state: string | null = null
  private scope?: Scope

  constructor(
    element: Element,
    parent?: PluncElementInterface<Element>
  ) {
    this.$element = element
    this.$parent = parent || null
  }

  get() {
    return this.$element
  }

  getState(): string | null {
    return this.state
  }

  setState(state: string) {
    if (state !== null) {
      this.state = state
    }
  }

  setScope(scope: Scope) {
    this.scope = scope
  }

  getScope() {
    return this.scope
  }

  addClass(className: string) {
    this.$element.classList.add(className)
  }

  hasClass(className: string): boolean {
    return this.$element.classList.contains(className)
  }

  listClass(): string[] {
    return this.$element.className.trim().split(/\s+/)
  }

  removeClass(className: string) {
    this.$element.classList.remove(className)
  }

  toggleClass(className: string) {
    this.$element.classList.toggle(className)
  }
}
