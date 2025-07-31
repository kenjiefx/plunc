import { AppConfiguration, PluncAttributeKey, RequireAllFields } from "../types"

/**
 * PluncAttributeKeyFormatter is a function that takes a key and returns a PluncAttributeKey.
 * It is used to format attribute keys with a specific prefix defined in the application configuration.
 */
export type PluncAttributeKeyFormatter = (key: string) => PluncAttributeKey

/**
 * @param key - The key to be prefixed.
 * @param config - The application configuration containing the prefix.
 * @returns PluncAttributeKeyFormatter
 */
export function createPluncAttributeKeyFormatter(config: Readonly<RequireAllFields<AppConfiguration>>) {
  const prefix = config.prefix
  return function (key: string): PluncAttributeKey {
    return `${prefix}${key}` as PluncAttributeKey
  }
}