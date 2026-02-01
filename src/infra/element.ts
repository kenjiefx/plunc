export function selectOneElement(
  context: HTMLElement,
  selector: string,
): HTMLElement | null {
  return context.querySelector<HTMLElement>(selector);
}

export function selectAllElements(
  context: HTMLElement,
  selector: string,
): Array<HTMLElement> {
  return Array.from(context.querySelectorAll<HTMLElement>(selector));
}
