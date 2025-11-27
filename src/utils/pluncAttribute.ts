import { PluncApp } from "../entities/plunc";
import { PluncAttributeKey } from "../types";

export const APP_ATTR = "app";
export const TEMPL_NAME_ATTR = "name";
export const SERVICE_OBJECT = "service_object";
export const FACTORY_OBJECT = "factory_object";
export const COMPONENT_OBJECT = "component_object";
export const COMPONENT_ELEMENT_ATTR = "component";
export const REPEAT_ELEMENT_ATTR = "repeat";
export const IF_ELEMENT_ATTR = "if";
export const HIDE_ELEMENT_ATTR = "hide";
export const SHOW_ELEMENT_ATTR = "show";
export const CHECK_ELEMENT_ATTR = "check";
export const STYLE_ELEMENT_ATTR = "style";
export const MODEL_ELEMENT_ATTR = "model";
export const DISABLE_ELEMENT_ATTR = "disable";
export const CLICK_EVENT_ATTR = "click";
export const CHANGE_EVENT_ATTR = "change";
export const TOUCH_EVENT_ATTR = "touch";
export const BLOCK_ELEMENT_ATTR = "block";
export const SCOPE_ARGUMENT_KEY = "$scope";
export const BLOCK_ARGUMENT_KEY = "$block";
export const PARENT_ARGUMENT_KEY = "$parent";
export const CHILDREN_ARGUMENT_KEY = "$children";
export const PATCH_ARGUMENT_KEY = "$patch";
export const APP_ARGUMENT_KEY = "$app";
export const COMPONENT_ARGUMENT_KEY = "$this";
export const STRAWBERRY_ID_ATTR = "id";
export const REPEAT_REFERENCE_TOKEN = "$$index";
export const LOCK_ID_ATTR_KEY = "set";
export const LOCK_ID_ATTR_VALUE = "true";
export const EVENT_ELEMENT_ATTR = "event";
export const ELEMENT_REFERENCE_ATTR = "rid";

export type PluncAttributeManager = ReturnType<typeof usePluncAttribute>;

export function usePluncAttribute(instance: PluncApp) {
  function create(key: string) {
    const prefix = instance.getConfig().prefix;
    return `${prefix}${key}` as PluncAttributeKey;
  }

  function createWithValue(key: string, value: string) {
    const prefix = instance.getConfig().prefix;
    return `${prefix}${key}="${value}"` as PluncAttributeKey;
  }

  return {
    create,
    createWithValue,
  };
}
