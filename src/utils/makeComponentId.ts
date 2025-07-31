import { ComponentId } from "../types";
import { PluncApp } from "./createPluncApp";

export function makeComponentIdGenerator(
  instance: PluncApp
) {
  return function (componentIteration: number, parentIteration: string = ''): ComponentId {
    if (parentIteration !== '') {
      return `${parentIteration}.${componentIteration.toString()}` as ComponentId
    }
    return `${instance.id}.${componentIteration.toString()}` as ComponentId
  }
}