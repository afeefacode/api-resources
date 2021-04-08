import { Field, FieldJSON } from '../field/Field'
import { getField } from '../field/FieldRegistry'

export type TypeJSON = {
  fields: Record<string, FieldJSON>
  update_fields: Record<string, FieldJSON>
  create_fields: Record<string, FieldJSON>
}

export class Type {
  private _fields: Record<string, Field> = {}
  private _updateFields: Record<string, Field> = {}
  private _createFields: Record<string, Field> = {}

  constructor (json: TypeJSON) {
    for (const [name, fieldJSON] of Object.entries(json.fields)) {
      const FieldClass = getField(fieldJSON.type)
      if (FieldClass) {
        const field = new FieldClass(fieldJSON)
        this._fields[name] = field
      }
    }

    if (json.update_fields) {
      for (const [name, fieldJSON] of Object.entries(json.update_fields)) {
        const FieldClass = getField(fieldJSON.type)
        if (FieldClass) {
          const field = new FieldClass(fieldJSON)
          this._updateFields[name] = field
        }
      }
    }

    if (json.create_fields) {
      for (const [name, fieldJSON] of Object.entries(json.create_fields)) {
        const FieldClass = getField(fieldJSON.type)
        if (FieldClass) {
          const field = new FieldClass(fieldJSON)
          this._createFields[name] = field
        }
      }
    }
  }
}
