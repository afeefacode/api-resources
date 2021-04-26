import { Model } from '@afeefa/api-resources-client'

export class RouteConfig {
  resourceName = ''
  actionName = ''

  Model = Model

  listFields = {}

  constructor (api) {
    this.api = api
  }

  get action () {
    return this.api.getAction(this.resourceName, this.actionName)
  }
}
