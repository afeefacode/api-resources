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
    constructor(type) {
        this.id = null;
        this._ID = ++ID;
        this._original = null;
        this.class = this.constructor;
        this.type = type || this.constructor.type;
    }
    static getType() {
        return apiResources.getType(this.type);
    }
    static create(json) {
        const ModelClass = apiResources.getModelClass(json.type);
        const model = new ModelClass();
        model.deserialize(json);
        return model;
    }
    static createForNew(fields) {
        const ModelType = this;
        const model = new ModelType();
        const type = this.getType();
        for (const [name, field] of Object.entries(type.getCreateFields())) {
            if (!fields || fields[name]) {
                model[name] = field.default();
            }
        }
        return model;
    }
    getType() {
        return apiResources.getType(this.type);
    }
    deserialize(json) {
        const type = apiResources.getType(json.type);
        this.id = json.id || null;
        this.type = type.name;
        for (const [name, field] of Object.entries(type.getFields())) {
            if (json[name] !== undefined) {
                this[name] = field.deserialize(json[name]);
            }
            if (field instanceof Relation && json['count_' + name] !== undefined) {
                this['count_' + name] = json['count_' + name];
            }
        }
    }
    cloneForEdit(fields) {
        const ModelClass = apiResources.getModelClass(this.type);
        const model = new ModelClass();
        model._original = this;
        if (this.id) {
            model.id = this.id;
        }
        const type = apiResources.getType(this.type);
        // console.log('cloneForEdit', this, fields, Object.entries(type.getUpdateFields()))
        // determine all allowed fields
        const typeFields = Object.assign(Object.assign({}, type.getFields()), type.getUpdateFields());
        for (const name of Object.keys(typeFields)) {
            if (!this[name]) { // value not set, just copy
                // console.log('novalue-copy', this, name)
                model[name] = this[name];
            }
            else {
                if (this[name] instanceof Model) { // has one relation
                    const relatedModel = this[name];
                    if (fields && fields[name]) { // clone related too
                        // console.log('one-relation', relatedModel, relatedFields, relatedModel.cloneForEdit(relatedFields as ModelAttributes))
                        model[name] = relatedModel.cloneForEdit(fields[name]);
                    }
                    else { // copy related
                        // console.log('one-relation-copy', relatedModel)
                        model[name] = relatedModel;
                    }
                }
                else if (Array.isArray(this[name])) { // has many relation or array
                    const relatedValues = this[name];
                    const newRelatedValues = [];
                    relatedValues.forEach(rv => {
                        if (rv instanceof Model) { // value is model
                            if (fields && fields[name]) { // clone model too
                                // console.log('many-relation', rv, relatedFields, rv.cloneForEdit(relatedFields as ModelAttributes))
                                newRelatedValues.push(rv.cloneForEdit(fields[name]));
                                return;
                            }
                        }
                        // console.log('many-relation-copy', rv)
                        newRelatedValues.push(rv); // copy value
                    });
                    model[name] = newRelatedValues;
                }
                else {
                    // console.log('value-copy', this, name)
                    model[name] = this[name];
                }
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
            if (!fields || fields[name]) {
                json[name] = field.serialize(this[name]);
            }
        }
        // check all given fields are allowed to update/create
        if (fields) {
            for (const name of Object.keys(fields)) {
                if (!typeFields[name]) {
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
