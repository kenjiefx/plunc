import { PluncAppConfiguration, RequireAllFields } from "../types";
import { Library } from "./library";
import { Registry } from "./registry";

export type PluncApp = Readonly<{
  config: Readonly<RequireAllFields<PluncAppConfiguration>>;
  library: Library;
  registry: Registry;
  name: string;
  id: number;
  toReady: () => void;
  isReady: () => boolean;
}>;

export function createPluncApp(
  name: string,
  id: number,
  configuration: Readonly<RequireAllFields<PluncAppConfiguration>>,
  registry: Registry,
  library: Library
): PluncApp {
  let ready = false;
  return {
    name,
    id,
    config: configuration,
    registry,
    library,
    toReady: () => {
      ready = true;
    },
    isReady: () => ready,
  };
}
