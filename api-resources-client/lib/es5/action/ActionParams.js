export class ActionParam {
    constructor(json) {
        this._values = {};
        this._type = json.type;
        for (const [key, value] of Object.entries(json)) {
            this._values[key] = value;
        }
    }
}
