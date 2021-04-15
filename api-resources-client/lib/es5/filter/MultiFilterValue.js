import { BaseFilterValue } from './BaseFilterValue';
import { FilterValue } from './FilterValue';
export class MultiFilterValue extends BaseFilterValue {
    constructor() {
        super(...arguments);
        this._values = {};
    }
    // constructor () {
    //   super()
    //   return new Proxy<MultiFilterValue>(this, {
    //     get: function (filterValue: MultiFilterValue, key: string): FilterValueType {
    //       return filterValue.values[key] || null
    //     },
    //     set: function (filterValue: MultiFilterValue, key: string, value: FilterValueType): boolean {
    //       const oldJson = filterValue.serialize()
    //       filterValue.values[key] = value
    //       const newJson = filterValue.serialize()
    //       if (JSON.stringify(newJson) !== JSON.stringify(oldJson)) {
    //         filterValue.valueChanged()
    //       } else {
    //         filterValue.values[key] = value
    //       }
    //       return true
    //     }
    //   })
    // }
    get value() {
        console.log('get multi value', this._values);
        const values = this._values;
        return {
            get page() {
                return values.page.value;
            },
            set page(page) {
                values.page.value = page;
            }
        };
    }
    deserialize(json) {
        for (const [key, valueJSON] of Object.entries(json)) {
            const value = new FilterValue(this.filter);
            value.deserialize(valueJSON);
            this._values[key] = value;
        }
    }
    serialize() {
        const json = {};
        for (const [key, value] of Object.entries(this._values)) {
            console.log('serialize, key, value', key, value);
            json[key] = value.serialize();
        }
        return json;
    }
    reset(defaultValue) {
        console.log('reset multi', defaultValue);
        for (const [key, value] of Object.entries(defaultValue._values)) {
            this._values[key] = value;
        }
    }
    valueChanged() {
        // console.log('multi filtervalue changed', this.filter, this._values)
    }
}
