import { Model, ModelConstructor, ModelJSON } from '../Model'

export class JsonObject extends Model {
  public static type = 'Afeefa.JsonObject'

  public deserialize (json: ModelJSON): void {
    this.class = this.constructor as ModelConstructor

    this.id = json.id || null
    this.type = this.class.type

    for (const [name, value] of Object.entries(json)) {
      this[name] = value
    }
  }
}
