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
        return this._params[ruleName];
    }
    get message() {
        return this.rule.getMessage(this.fieldLabel, this.getParams());
    }
}
