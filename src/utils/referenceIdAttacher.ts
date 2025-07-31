import { ComponentId } from "../types";
import { BLOCK_ELEMENT_ATTR, ELEMENT_REFERENCE_ATTR } from "./attributesList";
import { PluncAttributeFormatter } from "./pluncAttributeFormatter";
import { PluncAttributeKeyFormatter } from "./pluncAttributeKeyFormatter";
import { PluncAttributeValueGetter } from "./pluncAttributeValueGetter";

export type ReferenceIdAttacher = (
  componentId: ComponentId,
  componentImplementation: Document
) => void

export function createReferenceIdAttacher(
  pluncAttributeKeyFormatter: PluncAttributeKeyFormatter,
  pluncAttributeValueGetter: PluncAttributeValueGetter
) {
  return function (
    componentId: ComponentId,
    componentImplementation: Document
  ) {
    const referenceAttribute = pluncAttributeKeyFormatter(ELEMENT_REFERENCE_ATTR)
    const attributeList = [
      BLOCK_ELEMENT_ATTR
    ]
    const allElements: Array<Element> = []
    attributeList.forEach(attr => {
      const elements = Array.from(
        componentImplementation.body.querySelectorAll(
          `[${pluncAttributeKeyFormatter(attr)}]`
        )
      )
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i]
        const name = pluncAttributeValueGetter(element, attr)
        assertNamedElementFormat(name)
      }
      allElements.push(...elements)
    })
    /** For each named elements, we'll add reference ids */
    allElements.forEach((element) => {
      element.setAttribute(referenceAttribute, componentId)
    })
  }
}

function assertNamedElementFormat(name: string | null) {
  const message = `named element name must not be empty or contain invalid characters`
  if (name === null) {
    throw new Error(message)
  }
  if (!(typeof name === 'string')) {
    throw new Error(message)
  }
  if (name.includes("\\")) {
    throw new Error(message)
  }
}