import { Component } from "../models/component"
import { PluncApp } from "../models/plunc"
import { Resolver } from "../models/resolver"

export const __placeholderRenders = (element: Element, component: Component, instance: PluncApp): Promise<void> => {
  return new Promise (async (resolve, reject) => {
    try {
      const regularExp = /(?<=\{{).+?(?=\}})/g
      let template = element.innerHTML
      element.innerHTML = ''

      /** Match all regex in the innerHTML string of the element **/
      const placeholders = template.match(regularExp)

      /** When there are matches */
      if (placeholders !== null) {
        for (let i = 0; i < placeholders.length; i++) {
          const scope = component.__getScope()
            if (scope === null ) continue
            let resolvedExp
              = Resolver.__resolveExpression(scope, placeholders[i].trim())
            if (resolvedExp === undefined) {
              resolvedExp = '';
            }
            template = template.replace('{{'+placeholders[i]+'}}',resolvedExp)
        }
      }

      element.innerHTML = template
      resolve()

    } catch (error) {
      reject(error)
    }
  })
}