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
        if (this.id) {
            model.id = this.id;
        }
        const type = apiResources.getType(this.type);
        for (const [name, field] of Object.entries(type.getUpdateFields())) {
            if (!fields || fields[name]) {
                // TODO clone relations too
                model[name] = this[name] || field.default();
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
], Model.prototype, "class", void 0);
