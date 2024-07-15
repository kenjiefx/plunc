import { PluncApp } from "../models/plunc";
import { BLOCK_ELEMENT_ATTR, TEMPL_NAME_ATTR, XAttr } from "./attributes";
import { __makeTempElement } from "./elements";

/**
 * Retrieves the HTML content of a template.
 * @throw Error when there are no instance of the template
 * or there are two or more. Template names should be unique
 * throughout the application. 
 * @param instance PluncApp
 * @param name name of te template
 */
export const __getTempl = (instance: PluncApp, name: string) => {
  const selector = `
    template[${XAttr.__createWithValue(TEMPL_NAME_ATTR, instance, name)}]
  `
  const templateEl = document.querySelectorAll(`${selector.trim()}`)
  if (templateEl.length === 0) throw new Error(`102:${name}`)
  if (templateEl.length > 1) throw new Error(`103:${name}`)
  return templateEl[0].innerHTML
}


export const __getBlockTempl = (instance: PluncApp, component: string, block: string) => {
  const cTempl = __getTempl(instance, component)
  const cElem = __makeTempElement()
  cElem.innerHTML = cTempl
  const blockAttr = XAttr.__createWithValue(
    BLOCK_ELEMENT_ATTR,
    instance,
    block
  )
  const blockEl = cElem.querySelector(`[${blockAttr}]`)
  if (blockEl === null) return null 
  return blockEl.innerHTML
}