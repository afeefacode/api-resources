import { Api } from './api/Api'

export class Request {
  private _api!: Api

  public api (api: Api): Request {
    this._api = api
    return this
  }

  public getApi (): Api {
    return this._api
  }
}
