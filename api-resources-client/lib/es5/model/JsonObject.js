import { Model } from '../Model';
export class JsonObject extends Model {
    deserialize(json) {
        this.class = this.constructor;
        this.id = json.id || null;
        this.type = this.class.type;
        for (const [name, value] of Object.entries(json)) {
            this[name] = value;
        }
    }
}
JsonObject.type = 'Afeefa.JsonObject';
