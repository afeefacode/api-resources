import { apiResources } from '../ApiResources'
import { Field, FieldJSON } from '../field/Field'

export type TypeJSON = {
  fields: Record<string, FieldJSON>
  update_fields: Record<string, FieldJSON>
  create_fields: Record<string, FieldJSON>
}

export class Type {
  public name: string
  private _fields: Record<string, Field> = {}
  private _updateFields: Record<string, Field> = {}
  private _createFields: Record<string, Field> = {}

  constructor (name: string, json: TypeJSON) {
    this.name = name

    for (const [name, fieldJSON] of Object.entries(json.fields)) {
      const field = apiResources.getField(fieldJSON.type)
      if (field) {
        const typeField = field.createTypeField(name, fieldJSON)
        this._fields[name] = typeField
      }
    }

    if (json.update_fields) {
      for (const [name, fieldJSON] of Object.entries(json.update_fields)) {
        const field = apiResources.getField(fieldJSON.type)
        if (field) {
          const typeField = field.createTypeField(name, fieldJSON)
          this._updateFields[name] = typeField
        }
      }
    }

    if (json.create_fields) {
      for (const [name, fieldJSON] of Object.entries(json.create_fields)) {
        const field = apiResources.getField(fieldJSON.type)
        if (field) {
          const typeField = field.createTypeField(name, fieldJSON)
          this._createFields[name] = typeField
        }
      }
    }
  }

  public getFields (): Record<string, Field> {
    return this._fields
  }

  public getUpdateFields (): Record<string, Field> {
    return this._updateFields
  }

  public getCreateFields (): Record<string, Field> {
    return this._createFields
  }
}
