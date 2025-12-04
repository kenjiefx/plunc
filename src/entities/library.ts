import {
  FactoryHandlerFunction,
  HandlerFunction,
  HelperHandlerFunction,
  PluncHandlers,
} from "../types";

/**
 * A library of handler functions for components, services, factories, and helpers
 */
export type Library = {
  data: {
    [key: string]:
      | HandlerFunction<any, any>
      | FactoryHandlerFunction<any>
      | HelperHandlerFunction<any, any>;
  };
};

/**
 * Creates a new empty library
 * @returns
 */
export function createLibrary(): Library {
  return {
    data: {},
  };
}

/**
 * Creates a namespace string for a given handler type and name
 * @param type
 * @param name
 * @returns
 */
function createNamespace(type: PluncHandlers, name: string) {
  return `${type}.${name}`;
}

export function addToLibrary(
  library: Library,
  name: string,
  type: PluncHandlers,
  handler:
    | HandlerFunction<any, any>
    | FactoryHandlerFunction<any>
    | HelperHandlerFunction<any, any>
) {
  library.data[createNamespace(type, name)] = handler;
}

/**
 * Retrieves a component handler function from the library by its name
 * @param library
 * @param name
 * @returns
 */
export function getComponentHandlerFromLibrary(
  library: Library,
  name: string
): HandlerFunction<any, any> {
  const result = library.data[createNamespace("component", name)];
  if (!result) {
    throw new Error(`Component handler "${name}" not found in the library.`);
  }
  return result as HandlerFunction<any, any>;
}

/**
 * Retrieves a service handler function from the library by its name
 * @param library
 * @param name
 * @returns
 */
export function getServiceHandlerFromLibrary(
  library: Library,
  name: string
): HandlerFunction<any, any> | null {
  const result = library.data[createNamespace("service", name)];
  return (result ?? null) as HandlerFunction<any, any> | null;
}

/**
 * Retrieves a factory handler function from the library by its name
 * @param library
 * @param name
 * @returns
 */
export function getFactoryHandlerFromLibrary(
  library: Library,
  name: string
): FactoryHandlerFunction<any> | null {
  const result = library.data[createNamespace("factory", name)];
  return (result ?? null) as FactoryHandlerFunction<any> | null;
}

/**
 * Retrieves a helper handler function from the library by its name
 * @param library
 * @param name
 * @returns
 */
export function getHelperHandlerFromLibrary(
  library: Library,
  name: string
): HelperHandlerFunction<any, any> | null {
  const result = library.data[createNamespace("helper", name)];
  return (result ?? null) as HelperHandlerFunction<any, any> | null;
}
