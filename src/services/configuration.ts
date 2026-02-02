import { PluncAppConfiguration, RequireAllFields } from "../types";

export type ConfigurationResolver = (
  config: PluncAppConfiguration | null,
) => RequireAllFields<PluncAppConfiguration>;

/**
 * Resolves a PluncAppConfiguration by filling in default values for any missing fields.
 * @param config
 */
export function resolveConfiguration(
  config: PluncAppConfiguration | null,
): RequireAllFields<PluncAppConfiguration> {
  const startFn = (): Promise<boolean> =>
    new Promise((resolve) => resolve(true));
  const endFn = (): Promise<void> => new Promise((resolve) => resolve());
  return {
    prefix: config?.prefix ?? "plunc-",
    startFn: config?.startFn ?? startFn,
    endFn: config?.endFn ?? endFn,
  };
}
