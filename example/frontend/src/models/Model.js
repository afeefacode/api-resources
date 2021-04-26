import { Model as ApiResourcesModel } from '@afeefa/api-resources-client'

export class Model extends ApiResourcesModel {
  toCard () {
    return {
      type: 'Model',

      meta: '',

      title: `${this.type}:${this.id}`
    }
  }
}
