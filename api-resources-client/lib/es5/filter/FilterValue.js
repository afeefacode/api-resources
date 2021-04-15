import { BaseFilterValue } from './BaseFilterValue';
export class FilterValue extends BaseFilterValue {
    constructor() {
        super(...arguments);
        this._value = null;
        this._valueInitialized = false;
    }
    // constructor () {
    //   super()
    //   return new Proxy<FilterValue>(this, {
    //     get: function (filterValue: FilterValue, key: string): FilterValueType | Function {
    //       if (typeof filterValue[key] === 'function') {
    //         const method = filterValue[key] as Function
    //         return function (...args: unknown[]): unknown {
    //           return method.apply(filterValue, args) as unknown
    //         }
    //       }
    //       return filterValue.value
    //     },
    //     set: function (filterValue: FilterValue, _key: string, value: FilterValueType): boolean {
    //       const oldJson = filterValue.serialize()
    //       filterValue.value = value
    //       const newJson = filterValue.serialize()
    //       if (JSON.stringify(newJson) !== JSON.stringify(oldJson)) {
    //         filterValue.valueChanged()
    //       } else {
    //         filterValue.value = value
    //       }
    //       return true
    //     }
    //   })
    // }
    get value() {
        return this._value;
    }
    set value(value) {
        // console.log('set value', this.filter, value)
        if (value !== this._value) {
            this._value = value;
            if (this._valueInitialized) {
                this.valueChanged();
            }
        }
    }
    deserialize(json) {
        this.value = json;
    }
    serialize() {
        return this._value;
    }
    reset(defaultValue) {
        this._value = defaultValue.value;
    }
    valueChanged() {
        // console.log('simple filtervalue changed', this.value)
    }
}
