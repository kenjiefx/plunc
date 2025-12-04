import { createComponentFactory } from "../entities/component";
import {
  dissectRepeatExpression,
  calculateNumberOfRepetitions,
  isIterableWithObjectEntries,
} from "../renders/repeat";
import {
  getAttributeValue,
  createElement,
  copyBindElement,
  disposeElement,
  lockElement,
  isElementLocked,
} from "./elementHelper";
import { selectAllElementsByAttribute } from "./elementSelector";
import { resolveExpression } from "./expResolver";
import { createPluncAttribute } from "./pluncAttribute";

export type RenderHelpers = {
  createAttr: typeof createPluncAttribute;
  selectAllByAttribute: typeof selectAllElementsByAttribute;
  getAttrValue: typeof getAttributeValue;
  resolveExp: typeof resolveExpression;
  dissectRepeatExp: typeof dissectRepeatExpression;
  calcNumOfRep: typeof calculateNumberOfRepetitions;
  isIterable: typeof isIterableWithObjectEntries;
  createComponentFn: ReturnType<typeof createComponentFactory>;
  createElementFn: typeof createElement;
  copyBindElementFn: typeof copyBindElement;
};

export function useRenderHelpers() {
  return {
    createAttr: createPluncAttribute,
    selectAllByAttribute: selectAllElementsByAttribute,
    getAttrValue: getAttributeValue,
    resolveExp: resolveExpression,
    dissectRepeatExp: dissectRepeatExpression,
    calcNumOfRep: calculateNumberOfRepetitions,
    isIterable: isIterableWithObjectEntries,
    createComponentFn: createComponentFactory,
    createElementFn: createElement,
    copyBindElementFn: copyBindElement,
  };
}
