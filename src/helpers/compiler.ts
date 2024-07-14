import { PluncApp } from "../models/plunc";

export const __parseComponentNames = (template: string) => {
  const chars = template.split('')
  let recLine = ''
  let expEndSymb = false
  let expCloseTag = false
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]
    recLine += char
    if (char==='<' && !expEndSymb) {
      expEndSymb = true
    }
    if (char==='>' && expEndSymb) {
      if (recLine.includes('plunc-component')) {
        console.log(recLine)
        expEndSymb = false
        continue
      }
      //console.log(recLine)
      recLine = ''
      expEndSymb = false
    }
  }
}

export const __runCompiler = (instance: PluncApp, template: string) => {
  const components = []
  __parseComponentNames(template)
}

export type CompilerReport = {
  template: string,
  components: Array<{
    name: string
  }>
}