import { PluncAppConfiguration, RequireAllFields } from "../types";
import { Library } from "./library";
import { Registry } from "./registry";

export type PluncApp = Readonly<{
  config: Readonly<RequireAllFields<PluncAppConfiguration>>;
  library: Library;
  registry: Registry;
  name: string;
  id: number;
  onReadyLtns: Array<() => Promise<void>>;
  toReady: () => void;
  isReady: () => boolean;
  onReady: (listener: () => Promise<void>) => void;
}>;

export function createPluncApp(
  name: string,
  id: number,
  configuration: Readonly<RequireAllFields<PluncAppConfiguration>>,
  registry: Registry,
  library: Library,
): PluncApp {
  let ready = false;
  let onReadyLtns: Array<() => Promise<void>> = [];
  return {
    name,
    id,
    config: configuration,
    registry,
    library,
    onReadyLtns,
    toReady: () => {
      ready = true;
    },
    isReady: () => ready,
    onReady: (listener: () => Promise<void>) => {
      onReadyLtns.push(listener);
    },
  };
}
