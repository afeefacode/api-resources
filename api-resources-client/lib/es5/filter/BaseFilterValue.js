export class BaseFilterValue {
    constructor(filter) {
        this.filter = filter;
    }
    get value() {
        return null;
    }
    set value(_value) {
    }
    toString() {
        return '';
    }
    fromQuerySource(_query) {
    }
    toQuerySource() {
        return {};
    }
    deserialize(_json) {
    }
    serialize() {
        return null;
    }
    reset(_defaultValue) {
    }
    valueChanged() {
    }
}
