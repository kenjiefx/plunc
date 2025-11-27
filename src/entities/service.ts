export function createService() {
  return {};
}

export type Service = ReturnType<typeof createService>;
export type CreateService = typeof createService;
