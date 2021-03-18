import axios, { AxiosResponse } from "axios";

export class Client {
  get (url: string): Promise<AxiosResponse> {
    return axios.get(url)
  }

  post (url: string, params: object): Promise<AxiosResponse> {
    return axios.post(url, params)
  }
}
