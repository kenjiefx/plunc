export function nameAliasParser (name: string) {
  return {
    name: name.split(' as ')[0],
    alias: name.split(' as ')[1] ?? null
  }
}