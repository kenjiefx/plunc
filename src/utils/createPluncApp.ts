import { RequireAllFields, AppConfiguration } from "../types"
import { createHandlerRegistry } from "./createHandlerRegistry";
import { createInstanceRegistry } from "./createInstanceRegistry";
import { generateConfiguration } from "./generateConfiguration";

export type PluncApp = {
  id: number;
  name: string;
  configuration: RequireAllFields<AppConfiguration>;
  handlers: ReturnType<typeof createHandlerRegistry>;
  instances: ReturnType<typeof createInstanceRegistry>;
}

export function createPluncApp(
  id: number,
  name: string,
  configuration: ReturnType<typeof generateConfiguration>,
): PluncApp {
  return {
    id,
    name,
    configuration: generateConfiguration(configuration),
    handlers: createHandlerRegistry(),
    instances: createInstanceRegistry(),
  }
}