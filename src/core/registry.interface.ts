import {
  ComponentId,
  ComponentInternalRepresentation,
  Registry,
  ServiceId,
  ServiceInternalRepresentation,
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

export type AddServiceToRegistryFunction = (
  registry: Registry,
  id: ServiceId,
  service: ServiceInternalRepresentation,
) => void;

export type GetServicesFromRegistryByIdsFunction = (
  registry: Registry,
  ids: Array<ServiceId>,
) => ServiceInternalRepresentation[];

export type GetServiceFromRegistryByIdFunction = (
  registry: Registry,
  id: ServiceId,
) => ServiceInternalRepresentation | null;
