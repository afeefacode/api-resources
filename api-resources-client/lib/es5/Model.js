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
    serialize() {
        const json = {
            type: this.type
        };
        if (this.id) {
            json.id = this.id;
        }
        return json;
    }
}
Model.type = 'Model';
