import { Model as ApiResourcesModel } from '@afeefa/api-resources-client'

export class Model extends ApiResourcesModel {
  static RouteConfig = null

  static getLink (action) {
    return (new this()).getLink(action)
  }

  getLink (action = 'detail') {
    return {
      name: '',
      params: {}
    }
  }

  getTitle () {
    return null
  }
}
