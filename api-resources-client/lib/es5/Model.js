var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { apiResources } from './ApiResources';
import { Relation } from './field/Relation';
import { enumerable } from './utils/enumerable';
let ID = 0;
export class Model {
    constructor(...args) {
        this.id = null;
        this.type = 'Model';
        this._ID = ++ID;
        this._original = null;
        this.class = this.constructor;
        // type and data
        if (args.length === 2) {
            this.type = args[0];
            this.fill(args[1]);
            // type or data
        }
        else if (args.length === 1) {
            if (typeof args[0] === 'string') {
                this.type = args[0];
            }
            else {
                this.type = this.class.type;
                this.fill(args[0]);
            }
            // no type no data
        }
        else {
            this.type = this.class.type;
        }
    }
    static getType() {
        return apiResources.getType(this.type);
    }
    /**
     * Deserializes a server response json.
     */
    static fromJson(json) {
        let model;
        if (json.type) {
            const ModelClass = apiResources.getModelClass(json.type);
            model = new ModelClass();
        }
        else {
            model = new this();
            json.type = this.type;
        }
        model.deserialize(json);
        return model;
    }
    /**
     * Creates a new instance while setting all create fields to a default value.
     */
    static defaults(data) {
        const model = new this();
        const type = this.getType();
        for (const [name, field] of Object.entries(type.getCreateFields())) {
            model[name] = field.default();
        }
        if (data) {
            model.fill(data);
        }
        return model;
    }
    /**
     * Deletes all model attributes not included in fields.
     */
    withOnly(fields) {
        for (const name of Object.keys(this)) {
            if (name === 'id' || name === 'type') {
                continue;
            }
            if (!(fields === null || fields === void 0 ? void 0 : fields[name])) {
                delete this[name];
            }
        }
        return this;
    }
    /**
     * Deletes all model attributes included in fields.
     */
    without(fields) {
        for (const name of Object.keys(this)) {
            if (fields === null || fields === void 0 ? void 0 : fields[name]) {
                delete this[name];
            }
        }
        return this;
    }
    /**
     * Fills the model.
     */
    fill(data) {
        for (const [key, value] of Object.entries(data)) {
            this[key] = value;
        }
        return this;
    }
    /**
     * Returns the Type-instance associated to this model.
     */
    getType() {
        return apiResources.getType(this.type);
    }
    /**
     * Initializes the model with the given json data.
     */
    deserialize(json) {
        const type = apiResources.getType(json.type);
        this.id = json.id || null;
        this.type = type.name;
        for (const [name, field] of Object.entries(type.getFields())) {
            if (json[name] !== undefined) {
                this[name] = field.deserialize(json[name]);
            }
            else {
                this[name] = field.default(); // set a default value
            }
            if (field instanceof Relation && json['count_' + name] !== undefined) {
                this['count_' + name] = json['count_' + name];
            }
        }
    }
    clone(relationsToClone) {
        const ModelClass = apiResources.getModelClass(this.type);
        const model = new ModelClass();
        model._original = this;
        if (this.id) {
            model.id = this.id;
        }
        // copy / clone from original
        for (const [name, value] of Object.entries(this)) {
            const nestedRelationsToClone = typeof (relationsToClone === null || relationsToClone === void 0 ? void 0 : relationsToClone[name]) === 'object' ? relationsToClone[name] : undefined;
            if (value instanceof Model) { // has one relation
                const relatedModel = value;
                if (relationsToClone === null || relationsToClone === void 0 ? void 0 : relationsToClone[name]) { // clone related too
                    // console.log('one-relation', relatedModel, relationsToClone[name], relatedModel.clone(relationsToClone[name] as ModelAttributes))
                    model[name] = relatedModel.clone(nestedRelationsToClone);
                }
                else { // copy related
                    // console.log('one-relation-copy', relatedModel)
                    model[name] = relatedModel;
                }
            }
            else if (Array.isArray(value)) { // has many relation or array
                const relatedValues = value;
                const newRelatedValues = [];
                relatedValues.forEach(rv => {
                    if (rv instanceof Model && (relationsToClone === null || relationsToClone === void 0 ? void 0 : relationsToClone[name])) { // value is model to be also cloned
                        // console.log('many-relation', rv, relationsToClone[name], rv.clone(relationsToClone[name] as ModelAttributes))
                        newRelatedValues.push(rv.clone(nestedRelationsToClone));
                    }
                    else {
                        // console.log('many-relation-copy', rv)
                        newRelatedValues.push(rv); // copy value
                    }
                });
                model[name] = newRelatedValues;
            }
            else { // any other value gets copied
                // console.log('value-copy', this, name)
                model[name] = value;
            }
        }
        return model;
    }
    serialize(fields) {
        const json = {
            type: this.type
        };
        if (this.id) {
            json.id = this.id;
        }
        const type = apiResources.getType(this.type);
        const typeFields = this.id ? type.getUpdateFields() : type.getCreateFields();
        for (const [name, field] of Object.entries(typeFields)) {
            if (!fields || fields[name]) { // serialize all allowed fields (or only given ones of them, if specific fields are given)
                if (this.hasOwnProperty(name) && this[name] !== undefined) {
                    json[name] = field.serialize(this[name]);
                }
            }
        }
        // check all given fields are allowed to update/create
        if (fields) {
            for (const name of Object.keys(fields)) {
                if (fields[name] && !typeFields[name]) { // ignore false fields
                    console.warn(`Field "${name}" not configured for type ${this.type}#${this.id ? 'update' : 'create'}`);
                }
            }
        }
        return json;
    }
    equals(model) {
        if (!model) {
            return false;
        }
        return model.type === this.type && model.id === this.id;
    }
}
Model.type = 'Model';
__decorate([
    enumerable(false)
], Model.prototype, "_ID", void 0);
__decorate([
    enumerable(false)
], Model.prototype, "_original", void 0);
__decorate([
    enumerable(false)
], Model.prototype, "class", void 0);
