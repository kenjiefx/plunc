import { PluncException } from "../errors/exception";
import { InvalidLibrarySourceError } from "../errors/index";
import {
  FactoryHandlerFunction,
  HandlerFunction,
  HelperHandlerFunction,
  Library,
  LibraryBrand,
} from "../types";

/**
 * Internal implementation of library data structure
 */
type InternalLibrary = Library & {
  data: {
    component: Map<string, HandlerFunction<any, any>>;
    service: Map<string, HandlerFunction<any, any>>;
    factory: Map<string, FactoryHandlerFunction<any>>;
    helper: Map<string, HelperHandlerFunction<any, any>>;
  };
};

export function createNewHandlerLibrary(): Library {
  const library: InternalLibrary = {
    data: {
      component: new Map(),
      service: new Map(),
      factory: new Map(),
      helper: new Map(),
    },
    [LibraryBrand]: true,
  };
  return library;
}

function getInternalDataFromLibrary(library: Library): InternalLibrary {
  if ("data" in library) {
    return library as InternalLibrary;
  }
  // If the library does not have the expected structure, it
  // may have been created outside of this module.
  throw new PluncException<InvalidLibrarySourceError>("ERR4");
}

export function addHandlerToLibrary(
  library: Library,
  name: string,
  type: "component" | "service" | "factory" | "helper",
  handler:
    | HandlerFunction<any, any>
    | FactoryHandlerFunction<any>
    | HelperHandlerFunction<any, any>,
) {
  const internalData = getInternalDataFromLibrary(library);
  switch (type) {
    case "component":
      internalData.data.component.set(
        name,
        handler as HandlerFunction<any, any>,
      );
      break;
    case "service":
      internalData.data.service.set(name, handler as HandlerFunction<any, any>);
      break;
    case "factory":
      internalData.data.factory.set(
        name,
        handler as FactoryHandlerFunction<any>,
      );
      break;
    case "helper":
      internalData.data.helper.set(
        name,
        handler as HelperHandlerFunction<any, any>,
      );
      break;
  }
}

export function getComponentHandlerFromLibrary(
  library: Library,
  name: string,
): HandlerFunction<any, any> | null {
  const internalData = getInternalDataFromLibrary(library);
  return internalData.data.component.get(name) ?? null;
}

export function getServiceHandlerFromLibrary(
  library: Library,
  name: string,
): HandlerFunction<any, any> | null {
  const internalData = getInternalDataFromLibrary(library);
  return internalData.data.service.get(name) ?? null;
}

export function getFactoryHandlerFromLibrary(
  library: Library,
  name: string,
): FactoryHandlerFunction<any> | null {
  const internalData = getInternalDataFromLibrary(library);
  return internalData.data.factory.get(name) ?? null;
}

export function getHelperHandlerFromLibrary(
  library: Library,
  name: string,
): HelperHandlerFunction<any, any> | null {
  const internalData = getInternalDataFromLibrary(library);
  return internalData.data.helper.get(name) ?? null;
}
