import { PluncAppContainer } from "../container";

export function composeAppAPI(appCtx: PluncAppContainer) {
  return {
    ready: (listener: () => Promise<void>) => {
      appCtx.__getAppRepresentationInstance().__onReady(listener);
    },
  };
}
