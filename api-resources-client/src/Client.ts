import axios, { AxiosResponse } from 'axios'

export class Client {
  public get (url: string): Promise<AxiosResponse> {
    return axios.get(url)
  }

  public post (url: string, params: Record<string, unknown>): Promise<AxiosResponse> {
    return axios.post(url, params)
  }
}
