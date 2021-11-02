export class ListViewFilter {
    constructor(filter, model) {
        this._value = null;
        this._filter = filter;
        this._model = model;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        if (value !== this._value) {
            this._value = value;
            this._model.filterValueChanged();
        }
    }
}
