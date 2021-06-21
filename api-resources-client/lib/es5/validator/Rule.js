export class Rule {
    constructor(json) {
        this._message = json.message;
    }
    getMessage(fieldLabel, param) {
        const params = {
            fieldLabel,
            param
        };
        return this._message.replace(/{{\s*(\w+)\s*}}/g, function (placeholder, placeholderName) {
            return params[placeholderName] || placeholder;
        });
    }
}
