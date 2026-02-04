import {
  ComponentProxyFactory,
  ComponentProxyWrapper,
} from "../contracts/components";
import { ComponentId, ComponentInternalRepresentation } from "../types";

export function composeComponentProxyFactory(): ComponentProxyFactory {
  return function newComponentProxy(wrapper: ComponentProxyWrapper) {
    const handler: ProxyHandler<
      Record<ComponentId, ComponentInternalRepresentation>
    > = {
      get: function get(
        target: { [id: ComponentId]: ComponentInternalRepresentation },
        name: string,
      ) {
        for (const id in target) {
          const component: ComponentInternalRepresentation =
            target[id as ComponentId];
          const exposed = component.__getProxy();
          if (exposed === null) {
            const name = component.name;
            throw new Error(
              `Cannot invoke component` + ` "${name}}" before $app is ready`,
            );
          }
          if (!(name in exposed)) {
            throw new Error(
              `Calling undefined member "${name}" ` +
                `in component "${component.name}"`,
            );
          }
          return exposed[name];
        }
      },
    };
    return new Proxy(wrapper, handler);
  };
}
