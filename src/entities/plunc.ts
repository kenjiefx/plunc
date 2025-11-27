import { PluncAppConfiguration, RequireAllFields } from "../types";
import { Library } from "./library";
import { Registry } from "./registry"; // Already functional

export type PluncApp = ReturnType<typeof createPluncApp>;

export function createPluncApp(
  name: string,
  id: number,
  configuration: Readonly<RequireAllFields<PluncAppConfiguration>>,
  registry: Registry,
  library: Library
) {
  let ready = false;

  // local state stored in closure
  const config = configuration;

  function getConfig() {
    return config;
  }

  function getLibrary() {
    return library;
  }

  function getRegistry() {
    return registry;
  }

  function getName() {
    return name;
  }

  function getId() {
    return id;
  }

  function nowReady() {
    ready = true;
  }

  function isReady() {
    return ready;
  }

  return {
    getConfig,
    getLibrary,
    getRegistry,
    getName,
    getId,
    nowReady,
    isReady,
  } as const;
}
