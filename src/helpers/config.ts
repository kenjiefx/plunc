import { AppConfiguration, RequireAllFields } from "../interface";

export const __generateConf = (config: AppConfiguration | null): RequireAllFields<AppConfiguration> => {
  const startFn = (): Promise<boolean> => new Promise(resolve => resolve(true))
  const endFn = (): Promise<void> => new Promise(resolve => resolve())
  return {
    prefix: config?.prefix ?? 'plunc-',
    startFn: config?.startFn ?? startFn,
    endFn: config?.endFn ?? endFn
  }
}