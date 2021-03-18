import axios, { AxiosResponse } from "axios";

export class Resource {
  public type: string|null = null
  private proxy: Resource|null = null

  constructor (type: string) {
    this.type = type

    this.proxy = new Proxy(this, {
      get: (resource: Resource, key: string): any => {
        return (resource as any)[key]
      }
    })

    return this.proxy
  }

  list (): Promise<AxiosResponse> {
    return axios.post('/api/frontend', {
      resource: this.type
    })
  }
}
