import {
  ComponentExposedAPIProxy,
  ComponentId,
  ComponentInternalRepresentation,
  ComponentScope,
} from "../types";
import { AliasNotationParser } from "./alias";

/**
 * Composes a factory function for creating component internal representations.
 * @param aliasParser
 */
export type ComponentInternalRepresentationFactory = (
  id: ComponentId,
  nameThatMayHaveAlias: string,
) => ComponentInternalRepresentation;

export function createComponentInternalRepresentationFactory(
  aliasParser: AliasNotationParser,
) {
  return function createComponentInternalRepresentation(
    id: ComponentId,
    nameThatMayHaveAlias: string,
  ): ComponentInternalRepresentation {
    const { name, alias } = aliasParser(nameThatMayHaveAlias);
    let proxy: ComponentExposedAPIProxy | null = null;
    let template: string = `<!-- Component ${id} Template -->`;
    const scope: ComponentScope = {};
    function setProxy(p: ComponentExposedAPIProxy): void {
      proxy = p;
    }
    function getProxy(): ComponentExposedAPIProxy | null {
      return proxy;
    }
    function setTemplate(t: string): void {
      template = t;
    }
    function getTemplate(): string {
      return template;
    }
    return {
      id,
      name,
      alias,
      scope,
      setProxy,
      getProxy,
      setTemplate,
      getTemplate,
    };
  };
}
