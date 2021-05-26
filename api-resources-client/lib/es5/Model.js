import { apiResources } from './ApiResources';
import { Relation } from './field/Relation';
export class Model {
    constructor(type) {
        this.id = null;
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
        for (const name of Object.keys(type.getUpdateFields())) {
            if (!fields || fields[name]) {
                json[name] = this[name];
            }
        }
        return json;
    }
}
Model.type = 'Model';
