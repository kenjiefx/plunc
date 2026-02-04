import {
  RequireAllFields,
  PluncAppConfiguration,
  Library,
  Registry,
  PluncAppInternalRepresentation,
} from "../types";

export type CreatePluncAppInternalRepresentationFunction = (
  id: number,
  name: string,
  config: Readonly<RequireAllFields<PluncAppConfiguration>>,
  library: Library,
  registry: Registry,
) => PluncAppInternalRepresentation;
