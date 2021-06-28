import { AxiosError } from 'axios'

import { ApiRequest } from './ApiRequest'

export type ApiResponseErrorJSON = {
  message: string,
  exception: {message: string}[]
}

export class ApiError {
  public request: ApiRequest
  public error: AxiosError
  public message: string | null
  public detail: string | null

  constructor (request: ApiRequest, error: AxiosError) {
    this.request = request
    this.error = error

    this.message = this.getErrorDescription()
    this.detail = this.getErrorDetail()
  }

  private getErrorDescription (): string | null {
    if (this.error.response) {
      const data = this.error.response.data as ApiResponseErrorJSON
      if (data.message) {
        return data.message
      }
    }

    if (this.error.message) {
      return this.error.message
    }

    return null
  }

  private getErrorDetail (): string | null {
    if (this.error.response) {
      const data = this.error.response.data as ApiResponseErrorJSON
      if (data.exception && data.exception[0]) {
        return data.exception[0].message
      }
    }
    return null
  }
}
