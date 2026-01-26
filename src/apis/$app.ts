import { PluncAppContext } from "../services/contextBinder";

export function composeAppAPI(appCtx: PluncAppContext) {
  return {
    ready: (listener: () => Promise<void>) => {
      appCtx.__getInstance().onReady(listener);
    },
  };
}
