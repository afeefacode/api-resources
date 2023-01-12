import { AxiosError } from 'axios'

import { ApiRequest } from './ApiRequest'

export type ApiResponseErrorJSON = {
  message: string,
  error_details: string[] | string,
  exception: {message: string}[]
}

export class ApiError {
  public request: ApiRequest
  public error: AxiosError
  public message: string | null
  public detail: string[] | string | null
  public isCancel: boolean

  constructor (request: ApiRequest, error: AxiosError, isCancel: boolean = false) {
    this.request = request
    this.error = error

    this.message = this.getErrorMessage()
    this.detail = this.getErrorDetail()
    this.isCancel = isCancel
  }

  private getErrorMessage (): string | null {
    // error message from server
    if (this.error.response) {
      const data = this.error.response.data as ApiResponseErrorJSON
      if (data.message) {
        return data.message
      }
    }

    // else if error has a message field
    if (this.error.message) {
      return this.error.message
    }

    return null
  }

  private getErrorDetail (): string[] | string | null {
    // error message from server
    if (this.error.response) {
      const data = this.error.response.data as ApiResponseErrorJSON
      if (data.error_details) {
        return data.error_details
      }
    }

    return null
  }
}
