export class FieldSanitizer {
    constructor(sanitizer, params) {
        this.sanitizer = sanitizer;
        this._params = params;
    }
    get name() {
        return this.sanitizer.name;
    }
    get params() {
        return this.getParams();
    }
    getParams(sanitizerName = this.sanitizer.name) {
        if (this._params.hasOwnProperty(sanitizerName)) {
            return this._params[sanitizerName];
        }
        return this.sanitizer.default;
    }
}
