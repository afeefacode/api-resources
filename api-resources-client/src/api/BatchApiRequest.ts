import { ApiRequest } from './ApiRequest'
import { ApiResponse } from './ApiResponse'

export class BatchApiRequest extends ApiRequest {
  private currentPromise?: Promise<ApiResponse | boolean>

  public send (): Promise<ApiResponse | boolean> {
    if (this.currentPromise) {
      return this.currentPromise
    }

    this.currentPromise = new Promise(resolve => {
      setTimeout(() => {
        this.currentPromise = undefined
        resolve(super.send())
      }, 50)
    })

    return this.currentPromise
  }
}
