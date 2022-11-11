export class FieldRule {
    constructor(rule, params, fieldLabel) {
        this.rule = rule;
        this._params = params;
        this.fieldLabel = fieldLabel;
    }
    get name() {
        return this.rule.name;
    }
    get params() {
        return this.getParams();
    }
    getParams(ruleName = this.rule.name) {
        if (this._params.hasOwnProperty(ruleName)) {
            return this._params[ruleName];
        }
        return this.rule.default;
    }
    get message() {
        return this.rule.getMessage(this.fieldLabel, this.getParams());
    }
}
