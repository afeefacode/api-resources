import { Model as ApiResourcesModel } from '@afeefa/api-resources-client'

export class Model extends ApiResourcesModel {
  $components = {
    listCard: null
  }

  getRoute (_action) {
    return {}
  }
}
