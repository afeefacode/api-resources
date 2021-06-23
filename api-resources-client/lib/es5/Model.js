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
        this.type = type || this.constructor.type;
    }
    static create(json) {
        const ModelType = apiResources.getModel(json.type) || Model;
        const model = new ModelType();
        model.deserialize(json);
        return model;
    }
    static createForNew(fields) {
        const ModelType = this;
        const model = new ModelType();
        const type = apiResources.getType(this.type);
        for (const [name, field] of Object.entries(type.getCreateFields())) {
            if (fields[name]) {
                model[name] = field.default();
            }
        }
        return model;
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
        const ModelType = apiResources.getModel(this.type) || Model;
        const model = new ModelType();
        if (this.id) {
            model.id = this.id;
        }
        const type = apiResources.getType(this.type);
        for (const name of Object.keys(type.getUpdateFields())) {
            if (!fields || fields[name]) {
                model[name] = this[name];
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
        for (const [name, field] of Object.entries(type.getUpdateFields())) {
            if (!fields || fields[name]) {
                json[name] = field.serialize(this[name]);
            }
        }
        return json;
    }
}
Model.type = 'Model';
__decorate([
    enumerable(false)
], Model.prototype, "_ID", void 0);
