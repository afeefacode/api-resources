export class Rule {
    constructor(name, json) {
        this.name = name;
        this._message = json.message;
        this.default = json.default || null;
    }
    getMessage(fieldLabel, param) {
        const params = {
            fieldLabel,
            param
        };
        return this._message.replace(/{{\s*(\w+)\s*}}/g, function (placeholder, placeholderName) {
            return String(params[placeholderName]) || placeholder;
        });
    }
}
