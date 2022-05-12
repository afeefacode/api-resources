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
        const typeField = field.createTypeField(fieldJSON)
        this._fields[name] = typeField
      } else {
        console.warn(`No Field implementation for field ${name} type ${fieldJSON.type}.`)
      }
    }

    if (json.update_fields) {
      for (const [name, fieldJSON] of Object.entries(json.update_fields)) {
        const field = apiResources.getField(fieldJSON.type)
        if (field) {
          const typeField = field.createTypeField(fieldJSON)
          this._updateFields[name] = typeField
        } else {
          console.warn(`No Field implementation for field ${name} type ${fieldJSON.type}.`)
        }
      }
    }

    if (json.create_fields) {
      for (const [name, fieldJSON] of Object.entries(json.create_fields)) {
        const field = apiResources.getField(fieldJSON.type)
        if (field) {
          const typeField = field.createTypeField(fieldJSON)
          this._createFields[name] = typeField
        } else {
          console.warn(`No Field implementation for field ${name} type ${fieldJSON.type}.`)
        }
      }
    }
  }

  public getFields (): Record<string, Field> {
    return this._fields
  }

  public getField (name: string): Field | null {
    return this._fields[name] || null
  }

  public getUpdateFields (): Record<string, Field> {
    return this._updateFields
  }

  public getUpdateField (name: string): Field | null {
    return this._updateFields[name] || null
  }

  public getCreateFields (): Record<string, Field> {
    return this._createFields
  }

  public getCreateField (name: string): Field | null {
    return this._createFields[name] || null
  }
}
