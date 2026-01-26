import { HandlerFunction } from "../types";
import { PluncAppContext } from "./contextBinder";

/**
 * Creates a component binder function that binds name to handler in the given app context
 * @param appContext
 */
export function composeComponentBinder(appContext: PluncAppContext) {
  return function bindComponentToHandler<TComponent>(
    name: string,
    handler: HandlerFunction<unknown[], TComponent>,
  ) {
    appContext.__addToLibrary(name, "component", handler);
  };
}

/**
 * Creates a service binder function that binds name to handler in the given app context
 * @param appContext
 */
export function composeServiceBinder(appContext: PluncAppContext) {
  return function bindServiceToHandler<TService>(
    name: string,
    handler: HandlerFunction<unknown[], TService>,
  ) {
    appContext.__addToLibrary(name, "service", handler);
  };
}

/**
 * Creates a factory binder function that binds name to handler in the given app context
 * @param appContext
 */
export function composeFactoryBinder(appContext: PluncAppContext) {
  return function bindFactoryToHandler<TFactory>(
    name: string,
    handler: HandlerFunction<unknown[], TFactory>,
  ) {
    appContext.__addToLibrary(name, "factory", handler);
  };
}

/**
 * Creates a helper binder function that binds name to handler in the given app context
 * @param appContext
 */
export function composeHelperBinder(appContext: PluncAppContext) {
  return function bindHelperToHandler<THelper>(
    name: string,
    handler: HandlerFunction<unknown[], THelper>,
  ) {
    appContext.__addToLibrary(name, "helper", handler);
  };
}
