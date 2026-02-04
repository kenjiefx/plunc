import {
  RequireAllFields,
  PluncAppConfiguration,
  Library,
  Registry,
  PluncAppInternalRepresentation,
} from "../types";

export function createPluncAppInternalRepresentation(
  id: number,
  name: string,
  config: Readonly<RequireAllFields<PluncAppConfiguration>>,
  library: Library,
  registry: Registry,
): PluncAppInternalRepresentation {
  const onReadyListeners: Array<() => Promise<void>> = [];
  let ready = false;
  function __emitReady() {
    ready = true;
    for (const listener of onReadyListeners) {
      listener();
    }
  }
  function __isReady() {
    return ready;
  }
  function __onReady(listener: () => Promise<void>) {
    onReadyListeners.push(listener);
  }
  function __getReadyListeners() {
    return onReadyListeners;
  }
  return {
    config,
    library,
    registry,
    name,
    id,
    __getReadyListeners,
    __emitReady,
    __isReady,
    __onReady,
  };
}
