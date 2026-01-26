export function createService() {
  return {
    __brand__: Symbol("Service"),
  };
}

export type ServiceObject = Record<string, any> & {
  __brand__: Symbol;
};
export type CreateService = typeof createService;
