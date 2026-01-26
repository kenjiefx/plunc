import { ComponentObject } from "../entities/component";
import { ComponentId } from "../types";

/**
 * Composes a proxy for accessing component's exposed members.
 * Why a proxy? To provide a dynamic access to the component's exposed members,
 * allowing for lazy evaluation and error handling when accessing undefined members.
 * @param wrapper
 * @returns
 */
export type ComponentProxyFactory = (wrapper: {
  [id in ComponentId]: ComponentObject;
}) => { [id in ComponentId]: ComponentObject };

export type ComponentProxyWrapper = {
  [id in ComponentId]: ComponentObject;
};

export function composeComponentProxyFactory(): ComponentProxyFactory {
  return function newComponentProxy(wrapper: ComponentProxyWrapper) {
    const handler: ProxyHandler<Record<ComponentId, ComponentObject>> = {
      get: function get(
        target: { [id: ComponentId]: ComponentObject },
        name: string,
      ) {
        for (const id in target) {
          const component: ComponentObject = target[id as ComponentId];
          const exposed = component.proxy;
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
