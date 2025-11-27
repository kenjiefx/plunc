/**
 * Parses alias notation from a given string.
 * For example, "Component as Alias" will be parsed into
 * { name: "Component", alias: "Alias" }.
 * If no alias is provided, alias will be null.
 * @param name
 * @returns
 */
export function parseAliasNotation(name: string): {
  name: string;
  alias: string | null;
} {
  return {
    name: name.split(" as ")[0],
    alias: name.split(" as ")[1] ?? null,
  };
}

export type ParseAliasNotation = typeof parseAliasNotation;
