export class Request {
    api(api) {
        this._api = api;
        return this;
    }
    getApi() {
        return this._api;
    }
}
