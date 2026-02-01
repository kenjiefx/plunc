import {
  Registry,
  ComponentId,
  ComponentInternalRepresentation,
  ServiceName,
  ServiceExternalAPI,
} from "../types";

export type CreateRegistryFunction = () => Registry;

export type AddComponentToRegistryFunction = (
  registry: Registry,
  id: ComponentId,
  component: ComponentInternalRepresentation,
) => void;

export type GetComponentsFromRegistryByIdsFunction = (
  registry: Registry,
  ids: Array<ComponentId>,
) => ComponentInternalRepresentation[];

export type GetComponentFromRegistryByIdFunction = (
  registry: Registry,
  id: ComponentId,
) => ComponentInternalRepresentation | null;

export type GetAllComponentsFromRegistryFunction = (
  registry: Registry,
) => Array<ComponentInternalRepresentation>;

export type AddServiceToRegistryFunction = (
  registry: Registry,
  id: ServiceName,
  service: ServiceExternalAPI,
) => void;

export type GetServicesFromRegistryByIdsFunction = (
  registry: Registry,
  ids: Array<ServiceName>,
) => ServiceExternalAPI[];

export type GetServiceFromRegistryByIdFunction = (
  registry: Registry,
  id: ServiceName,
) => ServiceExternalAPI | null;
