import { ApplicationAPI } from "../api/app"
import { AppConfiguration, RequireAllFields } from "../interface"
import { Library } from "./library"
import { Registry } from "./registry"

export class PluncApp {
  private id: number
  private name: string
  private config: Readonly<RequireAllFields<AppConfiguration>>
  private library: Library
  private registry: Registry
  private api: ApplicationAPI
  private ready: boolean
  constructor(
    name: string, 
    id: number,
    configuration: Readonly<RequireAllFields<AppConfiguration>>
  ) {
    this.name = name 
    this.id = id
    this.config = configuration
    this.library = new Library
    this.registry = new Registry
    this.api = new ApplicationAPI
    this.ready = false
  }
  __config(): Readonly<RequireAllFields<AppConfiguration>>{
    return this.config
  }
  __library(){
    return this.library
  }
  __registry(){
    return this.registry
  }
  __getName(){
    return this.name
  }
  __getId(){
    return this.id
  }
  __getAPI(){
    return this.api
  }
  __nowReady(){
    this.ready = true
  }
  __isReady(){
    return this.ready
  }
}