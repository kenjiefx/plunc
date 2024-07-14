import { ComponentId, PluncAttributeKey } from "../interface"
import { PluncApp } from "../models/plunc"

export namespace XAttr {
    /**
     * Creates a component attribute with value. Example: `xcomponent="@ComponentName"`
     */
    export const __component = (name: string, instance: PluncApp) => {
      const prefix = instance.__config().prefix
      return  `${prefix}${COMPONENT_ELEMENT_ATTR}="@${name}"`
    }
    /**
     * Creates an attribute with any key. Example: `xsomekeyhere`
     */
    export const __create = (key:string, instance: PluncApp): PluncAttributeKey => {
      const prefix = instance.__config().prefix
      return `${prefix}${key}` as PluncAttributeKey
    }
    /**
     * Creates an attribute with any key, with any value. Example: `xsomekeyhere="value"`
     */
    export const  __createWithValue = (key: string, instance: PluncApp, value: string): PluncAttributeKey => {
      const prefix = instance.__config().prefix
      return `${prefix}${key}="${value}"` as PluncAttributeKey
    }

    export const __getValue = (element:Element, instance: PluncApp, key:string ) => {
      const prefix = instance.__config().prefix
      return element.getAttribute(`${prefix}${key}`)
    }

    export const __getElementByCId = (element:Element, instance: PluncApp, cid: ComponentId) => {
      const prefix = instance.__config().prefix
      const attr = `${prefix}id="${cid}"`
      return element.querySelector(`[${attr}]`)
    }

    export const __getElementsByAttr = (element:Element, instance: PluncApp ,name: string) => {
        const attr = __create(name, instance)
        return element.querySelectorAll(`[${attr}]`)
    }
}

export const APP_ATTR = 'app'
export const TEMPL_NAME_ATTR = 'name'
export const SERVICE_OBJECT = 'service_object'
export const FACTORY_OBJECT = 'factory_object'
export const COMPONENT_OBJECT = 'component_object'
export const COMPONENT_ELEMENT_ATTR = 'component'
export const REPEAT_ELEMENT_ATTR = 'repeat'
export const IF_ELEMENT_ATTR = 'if'
export const HIDE_ELEMENT_ATTR = 'hide'
export const SHOW_ELEMENT_ATTR = 'show'
export const CHECK_ELEMENT_ATTR = 'check'
export const STYLE_ELEMENT_ATTR = 'style'
export const MODEL_ELEMENT_ATTR = 'model'
export const DISABLE_ELEMENT_ATTR = 'disable'
export const CLICK_EVENT_ATTR = 'click'
export const CHANGE_EVENT_ATTR = 'change'
export const TOUCH_EVENT_ATTR = 'touch'
export const BLOCK_ELEMENT_ATTR = 'block'
export const SCOPE_ARGUMENT_KEY = '$scope'
export const BLOCK_ARGUMENT_KEY = '$block'
export const PARENT_ARGUMENT_KEY = '$parent'
export const CHILDREN_ARGUMENT_KEY = '$children'
export const PATCH_ARGUMENT_KEY = '$patch'
export const APP_ARGUMENT_KEY = '$app'
export const STRAWBERRY_ID_ATTR = 'id'
export const REPEAT_REFERENCE_TOKEN = '$$index'
export const LOCK_ID_ATTR_KEY = 'set'
export const LOCK_ID_ATTR_VALUE = 'true'
export const EVENT_ELEMENT_ATTR = 'event'
export const ELEMENT_REFERENCE_ATTR = 'rid'