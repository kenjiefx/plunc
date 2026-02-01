import {
  FactoryHandlerFunction,
  HandlerFunction,
  HelperHandlerFunction,
  Library,
} from "../types";

export type CreateLibraryFunction = () => Library;
export type AddToLibraryFunction = (
  library: Library,
  name: string,
  type: "component" | "service" | "factory" | "helper",
  handler:
    | HandlerFunction<any, any>
    | FactoryHandlerFunction<any>
    | HelperHandlerFunction<any, any>,
) => void;

export type GetComponentHandlerFromLibraryFunction = (
  library: Library,
  name: string,
) => HandlerFunction<any, any> | null;

export type GetServiceHandlerFromLibraryFunction = (
  library: Library,
  name: string,
) => HandlerFunction<any, any> | null;

export type GetFactoryHandlerFromLibraryFunction = (
  library: Library,
  name: string,
) => FactoryHandlerFunction<any> | null;

export type GetHelperHandlerFromLibraryFunction = (
  library: Library,
  name: string,
) => HelperHandlerFunction<any, any> | null;
