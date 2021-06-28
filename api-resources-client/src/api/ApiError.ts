import { AxiosError } from 'axios'

import { ApiRequest } from './ApiRequest'

export type ApiResponseErrorJSON = {
  message: string
}

export class ApiError {
  public request: ApiRequest
  public error: AxiosError
  public message: string

  constructor (request: ApiRequest, error: AxiosError) {
    this.request = request
    this.error = error
    this.message = this.getErrorDescription()
  }

  private getErrorDescription (): string {
    if (this.error.response) {
      const data = this.error.response.data as ApiResponseErrorJSON
      if (data.message) {
        return data.message
      }
    }

    return 'Es ist ein Fehler aufgetreten'
  }
}
