import { Api } from './Api'

export class ApiRequest {
  private _api!: Api

  public api (api: Api): ApiRequest {
    this._api = api
    return this
  }

  public getApi (): Api {
    return this._api
  }
}
