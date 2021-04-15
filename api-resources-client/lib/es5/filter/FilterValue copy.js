export class FilterValue {
    constructor() {
        this.value = null;
        return new Proxy(this, {
            get: function (filterValue) {
                return filterValue.value;
            },
            set: function (filterValue, _key, value) {
                const oldJson = filterValue.serialize();
                filterValue.value = value;
                const newJson = filterValue.serialize();
                if (JSON.stringify(newJson) !== JSON.stringify(oldJson)) {
                    filterValue.valueChanged();
                }
                else {
                    filterValue.value = value;
                }
                return true;
            }
        });
    }
    serialize() {
        return this.value;
    }
    valueChanged() {
    }
}
