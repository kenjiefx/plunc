import { PluncAppContainer } from "../container";
import { HandlerFunction } from "../types";

/**
 * Creates a component binder function that binds name to handler in the given app context
 * @param appContext
 */
export function composeComponentBinder(appContext: PluncAppContainer) {
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
export function composeServiceBinder(appContext: PluncAppContainer) {
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
export function composeFactoryBinder(appContext: PluncAppContainer) {
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
export function composeHelperBinder(appContext: PluncAppContainer) {
  return function bindHelperToHandler<THelper>(
    name: string,
    handler: HandlerFunction<unknown[], THelper>,
  ) {
    appContext.__addToLibrary(name, "helper", handler);
  };
}
