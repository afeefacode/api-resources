import { Model } from '@afeefa/api-resources-client'

export class RouteConfig {
  resourceName = ''

  listActionName = ''
  getActionName = ''

  Model = Model

  listFields = {}
  getFields = {}

  constructor (api) {
    this.api = api
  }

  get listAction () {
    return this.api.getAction(this.resourceName, this.listActionName)
  }

  get getAction () {
    return this.api.getAction(this.resourceName, this.getActionName)
  }
}
