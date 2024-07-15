import { PluncApp } from "../models/plunc";

export const __initStartFn = (app: PluncApp ): Promise<boolean> => {
  return app.__config().startFn()
}