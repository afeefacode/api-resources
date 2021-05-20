export class Rule {
    constructor(json) {
        this._message = json.message;
    }
    getMessage(fieldName, param) {
        const params = {
            fieldName,
            param
        };
        return this._message.replace(/{{\s*(\w+)\s*}}/g, function (placeholder, placeholderName) {
            return params[placeholderName] || placeholder;
        });
    }
}
