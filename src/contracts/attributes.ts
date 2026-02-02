import { PluncAttributeKey } from "../types";

/**
 * Formatter function type for Plunc attribute keys
 */
export type PluncAttributeKeyFormatter = (key: string) => PluncAttributeKey;

/**
 * Formatter function type for Plunc attribute key-value pairs
 */
export type PluncAttributeKeyValueFormatter = (
  key: string,
  value: string,
) => string;