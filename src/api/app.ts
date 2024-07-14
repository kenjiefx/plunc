import { PluncApp } from "../models/plunc"

export class ApplicationAPI {
  private listeners: {
    ready: Array<()=>void>
  }
  constructor(){
      this.listeners = {
        ready: []
      }
  }
  ready(listener:()=>any){
      this.listeners.ready.push(listener)
      return (this.listeners.ready.length)-1
  }
  __getListeners(key: string): Array<()=>void>{
    return this.listeners[key] ?? []
  }
}

export const __applicationAPI = (instance: PluncApp) => {
  return instance.__getAPI()
}