import '../filter/filters'
import '../validator/validators'
import '../field/fields'

import { Api } from './Api'

class ApiRegistry {
  private _apis: Record<string, Api> = {}

  public register (name: string, baseUrl: string): Api {
    const api = new Api(baseUrl)
    this._apis[name] = api
    return api
  }

  public get (name: string): Api | null {
    return this._apis[name] || null
  }
}

export const apiRegistry = new ApiRegistry()

export function registerApi (name: string, baseUrl: string): Api {
  return apiRegistry.register(name, baseUrl)
}

export function getApi (name: string): Api | null {
  return apiRegistry.get(name)
}
