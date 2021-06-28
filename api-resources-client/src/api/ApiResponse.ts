import { AxiosResponse } from 'axios'

import { Model, ModelJSON } from '../Model'
import { ApiRequest } from './ApiRequest'

export type ApiResponseDataJSON = ModelJSON | ModelJSON[]

export type ApiResponseJSON = {
  data: ApiResponseDataJSON
  meta: object
}

export class ApiResponse {
  public data: Model | Model[] | null = null
  public meta: object
  public request: ApiRequest

  constructor (request: ApiRequest, response: AxiosResponse<ApiResponseJSON>) {
    this.request = request

    const dataJSON = response.data.data
    if (Array.isArray(dataJSON)) {
      const models: Model[] = []
      dataJSON.forEach(json => {
        models.push(this.toModel(json))
      })
      this.data = models
    } else if (dataJSON) {
      this.data = this.toModel(dataJSON)
    }

    this.meta = response.data.meta
  }

  protected toModel (json: ModelJSON): Model {
    return Model.create(json)
  }
}
