import {
  FactoryHandlerFunction,
  HandlerFunction,
  HelperHandlerFunction,
  PluncHandlers,
} from "../types";

export type Library = ReturnType<typeof createLibrary>;

export function createLibrary() {
  const handlers: {
    [key: string]:
      | HandlerFunction<any, any>
      | FactoryHandlerFunction<any>
      | HelperHandlerFunction<any, any>;
  } = {};

  function createNamespace(type: PluncHandlers, name: string) {
    return `${type}.${name}`;
  }

  function register(
    name: string,
    type: PluncHandlers,
    handler:
      | HandlerFunction<any, any>
      | FactoryHandlerFunction<any>
      | HelperHandlerFunction<any, any>
  ) {
    handlers[createNamespace(type, name)] = handler;
  }

  function getComponent(name: string): HandlerFunction<any, any> {
    return handlers[createNamespace("component", name)] as HandlerFunction<
      any,
      any
    >;
  }

  function getService(name: string): HandlerFunction<any, any> | null {
    return (handlers[createNamespace("service", name)] ??
      null) as HandlerFunction<any, any> | null;
  }

  function getFactory(name: string): FactoryHandlerFunction<any> | null {
    return (handlers[createNamespace("factory", name)] ??
      null) as FactoryHandlerFunction<any> | null;
  }

  function getHelper(name: string): HelperHandlerFunction<any, any> | null {
    return (handlers[createNamespace("helper", name)] ??
      null) as HelperHandlerFunction<any, any> | null;
  }

  return {
    register,
    getComponent,
    getService,
    getFactory,
    getHelper,
  } as const;
}
