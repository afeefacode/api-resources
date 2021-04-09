export class ApiRequest {
    api(api) {
        this._api = api;
        return this;
    }
    getApi() {
        return this._api;
    }
}
