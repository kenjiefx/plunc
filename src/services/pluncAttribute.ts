import {
  PluncAttributeKeyFormatter,
  PluncAttributeKeyValueFormatter,
} from "../contracts/attributes";
import {
  PluncAppConfiguration,
  PluncAttributeKey,
  RequireAllFields,
} from "../types";

export const GLOBAL_DIRECTIVE_FOR_APP_NAME = "plunc-app";
export const GLOBAL_DIRECTIVE_FOR_TEMPLATE_NAME = "plunc-name";
export const GLOBAL_LOCK_ID_DIRECTIVE = "plunc-set";
export const GLOBAL_LOCK_ID_DIRECTIVE_VALUE = "true";
export const GLOBAL_EVENT_LOCK_DIRECTIVE = "plunc-event";
export const COMPONENT_ELEMENT_DIRECTIVE = "[PREFIX]component";
export const COMPONENT_ID_DIRECTIVE = "[PREFIX]cid";
export const REPEAT_ELEMENT_DIRECTIVE = "[PREFIX]repeat";
export const IF_ELEMENT_DIRECTIVE = "[PREFIX]if";
export const HIDE_ELEMENT_DIRECTIVE = "[PREFIX]hide";
export const SHOW_ELEMENT_DIRECTIVE = "[PREFIX]show";
export const CHECK_ELEMENT_DIRECTIVE = "[PREFIX]check";
export const STYLE_ELEMENT_DIRECTIVE = "[PREFIX]style";
export const MODEL_ELEMENT_DIRECTIVE = "[PREFIX]model";
export const DISABLE_ELEMENT_DIRECTIVE = "[PREFIX]disable";
export const CLICK_EVENT_DIRECTIVE = "[PREFIX]click";
export const CHANGE_EVENT_DIRECTIVE = "[PREFIX]change";
export const TOUCH_EVENT_DIRECTIVE = "[PREFIX]touch";
export const BLOCK_ELEMENT_DIRECTIVE = "[PREFIX]block";
export const COMPONENT_REFERENCE_DIRECTIVE = "[PREFIX]rid";
export const EVENT_ELEMENT_DIRECTIVE = "[PREFIX]event";
export const SCOPE_ARGUMENT_KEY = "$scope";
export const BLOCK_ARGUMENT_KEY = "$block";
export const PARENT_ARGUMENT_KEY = "$parent";
export const CHILDREN_ARGUMENT_KEY = "$children";
export const PATCH_ARGUMENT_KEY = "$patch";
export const APP_ARGUMENT_KEY = "$app";
export const COMPONENT_ARGUMENT_KEY = "$this";
export const REPEAT_REFERENCE_TOKEN = "$$index";

/**
 * Creates a formatter function for Plunc attribute keys
 * with the configured prefix.
 * @param instance
 */
export function composePluncAttributeKeyFormatter(
  config: Readonly<RequireAllFields<PluncAppConfiguration>>,
): PluncAttributeKeyFormatter {
  const prefix = config.prefix;
  return function pluncAttributeFormatter(key: string) {
    return key.replace("[PREFIX]", prefix) as PluncAttributeKey;
  };
}

/**
 * Creates a formatter function for Plunc attribute key-value pairs
 * with the configured prefix.
 * @param attributeKeyFormatter
 */
export function createPluncAttributeKeyValueFormatter(
  attributeKeyFormatter: PluncAttributeKeyFormatter,
): PluncAttributeKeyValueFormatter {
  return function (key: string, value: string) {
    const prefixedKey = attributeKeyFormatter(key);
    return `${prefixedKey}="${value}"`;
  };
}
