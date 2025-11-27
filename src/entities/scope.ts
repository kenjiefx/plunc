export type Scope = ReturnType<typeof createScope>;

export function createScope() {
  return {};
}

export type CreateScope = typeof createScope;
