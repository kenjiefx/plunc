import { PluncException } from "../errors/exception";
import { InvalidRegistrySourceError } from "../errors/index";
import {
  ComponentId,
  ComponentInternalRepresentation,
  Registry,
  RegistryBrand,
  ServiceId,
  ServiceInternalRepresentation,
} from "../types";

type RegistryInternalImplementation = Registry & {
  data: {
    components: Map<ComponentId, ComponentInternalRepresentation>;
    services: Map<ServiceId, ServiceInternalRepresentation>;
  };
};

export function createNewComponentAndServiceRegistry() {
  const registry: RegistryInternalImplementation = {
    data: {
      components: new Map(),
      services: new Map(),
    },
    [RegistryBrand]: true,
  };
  return registry;
}

function getInternalRegistryData(
  registry: Registry,
): RegistryInternalImplementation {
  if ("data" in registry) {
    return registry as RegistryInternalImplementation;
  }
  throw new PluncException<InvalidRegistrySourceError>("ERR6");
}

export function addComponentToRegistry(
  registry: Registry,
  id: ComponentId,
  component: ComponentInternalRepresentation,
) {
  const internalRegistry = getInternalRegistryData(registry);
  internalRegistry.data.components.set(id, component);
}

export function getComponentFromRegistryById(
  registry: Registry,
  id: ComponentId,
): ComponentInternalRepresentation | null {
  const internalRegistry = getInternalRegistryData(registry);
  return internalRegistry.data.components.get(id) ?? null;
}

export function getComponentsFromRegistryByIds(
  registry: Registry,
  ids: Array<ComponentId>,
): ComponentInternalRepresentation[] {
  const internalRegistry = getInternalRegistryData(registry);
  const components: ComponentInternalRepresentation[] = [];
  ids.forEach((id) => {
    const component = internalRegistry.data.components.get(id);
    if (component) {
      components.push(component);
    }
  });
  return components;
}

export function addServiceToRegistry(
  registry: Registry,
  id: ServiceId,
  service: ServiceInternalRepresentation,
) {
  const internalRegistry = getInternalRegistryData(registry);
  internalRegistry.data.services.set(id, service);
}

export function getServiceFromRegistryById(
  registry: Registry,
  id: ServiceId,
): ServiceInternalRepresentation | null {
  const internalRegistry = getInternalRegistryData(registry);
  return internalRegistry.data.services.get(id) ?? null;
}

export function getServicesFromRegistryByIds(
  registry: Registry,
  ids: Array<ServiceId>,
): ServiceInternalRepresentation[] {
  const internalRegistry = getInternalRegistryData(registry);
  const services: ServiceInternalRepresentation[] = [];
  ids.forEach((id) => {
    const service = internalRegistry.data.services.get(id);
    if (service) {
      services.push(service);
    }
  });
  return services;
}
