import { composeAppAPI } from "../apis/$app";
import { composeBlockAPI } from "../apis/$block";
import { composeParentAPI } from "../apis/$parent";
import { composePatchAPI } from "../apis/$patch";
import { composeComponentAPI } from "../apis/$this";
import { PluncAppContainer } from "../container";
import { ComponentProxyWrapper } from "../contracts/components";
import {
  ComponentExposedAPIProxy,
  ComponentId,
  ComponentInternalRepresentation,
  ComponentScope,
  FactoryHandlerFunction,
  HandlerFunction,
  HelperHandlerFunction,
  ResolvedHandlers,
  ServiceExternalAPI,
  ServiceName,
} from "../types";
import {
  APP_ARGUMENT_KEY,
  BLOCK_ARGUMENT_KEY,
  COMPONENT_ARGUMENT_KEY,
  PARENT_ARGUMENT_KEY,
  PATCH_ARGUMENT_KEY,
  SCOPE_ARGUMENT_KEY,
} from "./pluncAttribute";

/**
 * Parses the function parameters to extract dependency names.
 * @param handler - a typeof function
 * @returns
 */
export function listDependencies(
  handler:
    | HandlerFunction<any, any>
    | FactoryHandlerFunction<any>
    | HelperHandlerFunction<any, any>,
): Array<string> {
  const handlerStr = handler.toString().split("{")[0];
  if (handlerStr.charAt(0) !== "(") {
    const param = handlerStr.split("=>")[0];
    if (param === handlerStr) {
      return [];
    }
    return [param.trim()];
  }
  const matchedFn = handlerStr.match(/(?<=\().+?(?=\))/g);
  if (matchedFn === null || /[(={})]/g.test(matchedFn[0])) {
    return [];
  }
  return matchedFn[0].split(",").map((item) => {
    return item.trim();
  });
}

export type DependencyResolverParam =
  | {
      dependencies: Array<string>;
      type: "component";
      component: ComponentInternalRepresentation;
    }
  | {
      dependencies: Array<string>;
      type: "service";
    }
  | {
      dependencies: Array<string>;
      type: "factory";
    }
  | {
      dependencies: Array<string>;
      type: "helper";
      component: ComponentInternalRepresentation;
    };

export function composeDependencyResolver(
  appCtx: PluncAppContainer,
  listDependenciesFn: typeof listDependencies,
) {
  return function resolveDependency(
    param: DependencyResolverParam,
  ): Array<ResolvedHandlers> {
    const injectables: Array<ResolvedHandlers> = [];
    param.dependencies.forEach((dependencyKey) => {
      if (isScopeArgumentKey(dependencyKey)) {
        injectables.push(resolveScopeParam(param));
        return;
      }
      if (isAPIDependency(dependencyKey)) {
        injectables.push(resolveAPIDependency(dependencyKey, param, appCtx));
        return;
      }
      if (isServiceDependency(appCtx, dependencyKey)) {
        const serviceObject = invokeServiceHandler(
          dependencyKey as ServiceName,
          appCtx,
          listDependenciesFn,
          resolveDependency,
        );
        injectables.push(serviceObject);
        return;
      }
      if (isFactoryDependency(appCtx, dependencyKey)) {
        const factory = invokeFactoryHandler(
          dependencyKey,
          appCtx,
          listDependenciesFn,
          resolveDependency,
        );
        injectables.push(factory);
        return;
      }
      if (isHelperDependency(appCtx, dependencyKey)) {
        if (param.type === "component" || param.type === "helper") {
          const helper = invokeHelperHandler(
            dependencyKey,
            appCtx,
            listDependenciesFn,
            resolveDependency,
            param.component,
          );
          injectables.push(helper);
          return;
        } else {
          throw new Error(
            `Helper dependency "${dependencyKey}" can only be injected into components or helpers`,
          );
        }
      }

      // component
      if (param.type === "component") {
        const componentProxy = resolveComponentDependencyWithNameOrAlias(
          dependencyKey,
          param.component,
          appCtx,
        );
        injectables.push(componentProxy);
        return;
      }

      // If all else fails to match, we'll push a null value
      // and throw a warning
      console.warn(`Unresolved dependency: "${dependencyKey}"`);
      injectables.push(null);
    });
    return injectables;
  };
}

function isScopeArgumentKey(value: string): boolean {
  return value === SCOPE_ARGUMENT_KEY;
}

function isAPIDependency(value: string): boolean {
  return value.startsWith("$");
}

function isServiceDependency(
  appCtx: PluncAppContainer,
  value: string,
): boolean {
  const service = appCtx.__getServiceHandler(value);
  return service !== null;
}

function isFactoryDependency(
  appCtx: PluncAppContainer,
  value: string,
): boolean {
  const factory = appCtx.__getFactoryHandler(value);
  return factory !== null;
}

function isHelperDependency(appCtx: PluncAppContainer, value: string): boolean {
  const helper = appCtx.__getHelperHandler(value);
  return helper !== null;
}

export function resolveScopeParam(
  param: DependencyResolverParam,
): ComponentScope | null {
  if (param.type === "component" || param.type === "helper") {
    return param.component.scope;
  }
  return null;
}

export function resolveAPIDependency(
  dependencyKey: string,
  param: DependencyResolverParam,
  appCtx: PluncAppContainer,
) {
  if (param.type === "service" || param.type === "factory") {
    return {};
  }
  switch (dependencyKey) {
    case BLOCK_ARGUMENT_KEY:
      return composeBlockAPI(appCtx, param.component);

    case PATCH_ARGUMENT_KEY:
      return composePatchAPI(appCtx, param.component);

    case PARENT_ARGUMENT_KEY:
      return composeParentAPI(appCtx, param.component);

    case APP_ARGUMENT_KEY:
      return composeAppAPI(appCtx);

    case COMPONENT_ARGUMENT_KEY:
      return composeComponentAPI(appCtx, param.component);

    default:
      return {};
  }
}

/**
 * Ensures that a component does not directly depend on any of its parent components.
 *
 * In plunc.js, components can depend on services or other components, but
 * the dependency graph must remain **acyclic** to prevent circular references.
 *
 * This function checks if the given `dependencyKey` is among the ancestors of
 * the `component` in the lineage. If it is, that would create a circular
 * dependency, which is **not allowed** and would break the DI resolution.
 *
 * Special cases like `$parent` or lazy references are handled differently
 * (evaluated at runtime), but direct injection of parent components is forbidden.
 *
 * @param component - The component that is declaring a dependency.
 * @param dependencyKey - The name of the dependency being injected.
 * @param appCtx - The application context containing the component lineage.
 *
 * @throws Error if the dependency is one of the component's parents, enforcing
 *               the acyclic dependency rule.
 */
export function assertIsNotDependeningOnItsParents(
  component: ComponentInternalRepresentation,
  dependencyKey: string,
  appCtx: PluncAppContainer,
  options: { tryAlias: boolean },
) {
  const parentNames = recursivelyGetParentNames(appCtx, component.id, options);
  if (parentNames.has(dependencyKey)) {
    throw new Error(
      `Circular dependency detected: ` +
        `Component "${component.name}" cannot depend on its parent "${dependencyKey}".`,
    );
  }
}

function recursivelyGetParentNames(
  appCtx: PluncAppContainer,
  componentId: ComponentId,
  options: { tryAlias: boolean },
): Set<string> {
  const parentNames = new Set<string>();
  const parentId = appCtx.__whoIsTheParent(componentId);
  if (parentId !== null) {
    const parent = appCtx.__getComponentFromRegistryById(parentId);
    if (parent !== null) {
      if (options.tryAlias) {
        if (parent.alias !== null) {
          parentNames.add(parent.alias);
        }
      } else {
        parentNames.add(parent.name);
      }
      const grandparents = recursivelyGetParentNames(appCtx, parentId, options);
      grandparents.forEach((name) => parentNames.add(name));
    }
  }
  return parentNames;
}

export function resolveComponentDependencyWithNameOrAlias(
  dependencyKey: string,
  component: ComponentInternalRepresentation,
  appCtx: PluncAppContainer,
) {
  function execute({ withAlias }: { withAlias: boolean }) {
    // Before we resolve any component dependency, we need to make sure
    // that we are not trying to resolve a circular dependency
    assertIsNotDependeningOnItsParents(component, dependencyKey, appCtx, {
      tryAlias: withAlias,
    });
    let componentProxy = resolveComponentDependency(
      dependencyKey,
      component,
      appCtx,
      { matchUsingAlias: withAlias },
    );
    return componentProxy;
  }
  const componentProxy = execute({ withAlias: false });
  if (componentProxy !== null) {
    return componentProxy;
  }
  // Perhaps, the name in the dependencyKey refers to an
  // alias of the component
  return execute({ withAlias: true });
}

export function resolveComponentDependency(
  dependencyKey: string,
  component: ComponentInternalRepresentation,
  appCtx: PluncAppContainer,
  options: { matchUsingAlias: boolean },
): Record<ComponentId, ComponentInternalRepresentation> | null {
  if (component.name === dependencyKey) {
    throw new Error(
      `Circular dependency detected: ` +
        `Component "${component.name}" cannot depend on itself.`,
    );
  }
  const matchedChildren = matchChildComponentsByName(
    component,
    dependencyKey,
    appCtx,
    options,
  );
  if (matchedChildren.length > 0) {
    const wrapper: ComponentProxyWrapper = {};
    for (let i = 0; i < matchedChildren.length; i++) {
      const child = matchedChildren[i];
      const proxy = invokeComponentHandler(
        child.name,
        child,
        appCtx,
        listDependencies,
        composeDependencyResolver(appCtx, listDependencies),
      );
      wrapper[child.id] = child;
    }
    return appCtx.__createComponentProxy(wrapper);
  }
  return null;
}

function matchChildComponentsByName(
  parent: ComponentInternalRepresentation,
  name: string,
  appCtx: PluncAppContainer,
  options: { matchUsingAlias: boolean },
): Array<ComponentInternalRepresentation> {
  const childrenIds = appCtx.__whoAreTheChildren(parent.id);
  const matchedChildren: Array<ComponentInternalRepresentation> = [];
  childrenIds.forEach((childId) => {
    const child = appCtx.__getComponentFromRegistryById(childId);
    if (child !== null) {
      if (options.matchUsingAlias && child.alias === name) {
        matchedChildren.push(child);
        return;
      }
      if (!options.matchUsingAlias && child.name === name) {
        matchedChildren.push(child);
        return;
      }
    }
  });
  return matchedChildren;
}

export function invokeComponentHandler(
  name: string,
  ComponentInternalRepresentation: ComponentInternalRepresentation,
  appCtx: PluncAppContainer,
  listDependenciesFn: typeof listDependencies,
  resolveDependenciesFn: ReturnType<typeof composeDependencyResolver>,
): ComponentExposedAPIProxy {
  const proxy: ComponentExposedAPIProxy | null =
    ComponentInternalRepresentation.__getProxy();
  if (proxy !== null) {
    // To avoid re-invoking the component handler if the proxy already exists
    // (i.e., the component has already been initialized) we'll return the existing proxy
    return proxy;
  }
  const handler = appCtx.__getComponentHandler(name);
  if (handler === null) {
    throw new Error(`Missing component handler ${name}`);
  }
  const dependencies = listDependenciesFn(handler);
  const injectables = resolveDependenciesFn({
    dependencies: dependencies,
    type: "component",
    component: ComponentInternalRepresentation,
  });
  const exposedProxy = handler(...injectables) as ComponentExposedAPIProxy;
  ComponentInternalRepresentation.__setProxy(exposedProxy);
  return exposedProxy;
}

export function invokeFactoryHandler(
  name: string,
  appCtx: PluncAppContainer,
  listDependenciesFn: typeof listDependencies,
  resolveDependenciesFn: ReturnType<typeof composeDependencyResolver>,
): new (...args: any[]) => any {
  let handler = appCtx.__getFactoryHandler(name);
  if (handler === null) {
    throw new Error(`Missing factory handler ${name}`);
  }
  const dependencies = listDependenciesFn(handler);
  const injectables = resolveDependenciesFn({
    dependencies: dependencies,
    type: "factory",
  });
  const factory = handler(...injectables);
  if (typeof factory === "function") {
    return factory;
  }
  throw new Error(`Factory ${name} handler must return class reference`);
}

export function invokeServiceHandler(
  name: ServiceName,
  appCtx: PluncAppContainer,
  listDependenciesFn: typeof listDependencies,
  resolveDependenciesFn: ReturnType<typeof composeDependencyResolver>,
): ServiceExternalAPI {
  const serviceInternalRepresentation =
    appCtx.__getServiceFromRegistryById(name);

  const handler = appCtx.__getServiceHandler(name);
  if (handler === null) {
    throw new Error(`Missing service handler ${name}`);
  }
  const dependencies = listDependenciesFn(handler);
  const injectables = resolveDependenciesFn({
    dependencies: dependencies,
    type: "service",
  });
  let serviceExternalApi = handler(...injectables) as ServiceExternalAPI;
  if (serviceExternalApi === undefined || serviceExternalApi === null) {
    // We should not throw an error if the service handler
    // does not return anything. Instead, we just create
    // an empty service external API object. This is prevent
    // executing the same service handler multiple times.
    // Why it executes multiple times? Because each time
    // a component depends on the service, the handler
    // is invoked again if we do not store the result.
    serviceExternalApi = {} as ServiceExternalAPI;
  }
  appCtx.__addServiceToRegistry(name, serviceExternalApi);
  return serviceExternalApi;
}

export function invokeHelperHandler(
  name: string,
  appCtx: PluncAppContainer,
  listDependenciesFn: typeof listDependencies,
  resolveDependenciesFn: ReturnType<typeof composeDependencyResolver>,
  component: ComponentInternalRepresentation,
): Record<string, any> {
  let handler = appCtx.__getHelperHandler(name);
  if (handler === null) {
    throw new Error(`Missing helper handler ${name}`);
  }
  const dependencies = listDependenciesFn(handler);
  const injectables = resolveDependenciesFn({
    component: component,
    dependencies: dependencies,
    type: "helper",
  });
  const helper = handler(...injectables) as Record<string, any>;
  if (helper !== undefined && helper !== null) {
    // assert that helper is an object
    if (typeof helper !== "object") {
      throw new Error(`Helper ${name} must return an object`);
    }
  }
  return helper;
}
