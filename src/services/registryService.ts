import { PluncError, InvalidRegistrySourceError } from "../errors/pluncError";
import {
  ComponentId,
  ComponentInternalRepresentation,
  Registry,
  RegistryBrand,
  ServiceExternalAPI,
  ServiceName,
} from "../types";

type RegistryInternalImplementation = Registry & {
  data: {
    components: Map<ComponentId, ComponentInternalRepresentation>;
    services: Map<ServiceName, ServiceExternalAPI>;
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
  throw new PluncError<InvalidRegistrySourceError>("ERR6");
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

export function getAllComponentsFromRegistry(
  registry: Registry,
): Array<ComponentInternalRepresentation> {
  const internalRegistry = getInternalRegistryData(registry);
  return Array.from(internalRegistry.data.components.values());
}

export function addServiceToRegistry(
  registry: Registry,
  name: ServiceName,
  service: ServiceExternalAPI,
) {
  const internalRegistry = getInternalRegistryData(registry);
  internalRegistry.data.services.set(name, service);
}

export function getServiceFromRegistryById(
  registry: Registry,
  name: ServiceName,
): ServiceExternalAPI | null {
  const internalRegistry = getInternalRegistryData(registry);
  return internalRegistry.data.services.get(name) ?? null;
}

export function getServicesFromRegistryByIds(
  registry: Registry,
  ids: Array<ServiceName>,
): ServiceExternalAPI[] {
  const internalRegistry = getInternalRegistryData(registry);
  const services: ServiceExternalAPI[] = [];
  ids.forEach((id) => {
    const service = internalRegistry.data.services.get(id);
    if (service) {
      services.push(service);
    }
  });
  return services;
}
