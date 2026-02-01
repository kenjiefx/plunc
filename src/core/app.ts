import {
  RequireAllFields,
  PluncAppConfiguration,
  Library,
  Registry,
} from "../types";

export function createPluncAppInternalRepresentation(
  id: number,
  name: string,
  config: Readonly<RequireAllFields<PluncAppConfiguration>>,
  library: Library,
  registry: Registry,
) {
  const onReadyListeners: Array<() => Promise<void>> = [];
  let ready = false;
  function emitReady() {
    ready = true;
    for (const listener of onReadyListeners) {
      listener();
    }
  }
  function isReady() {
    return ready;
  }
  function onReady(listener: () => Promise<void>) {
    onReadyListeners.push(listener);
  }
  return {
    config,
    library,
    registry,
    name,
    id,
    emitReady,
    isReady,
    onReady,
  };
}
