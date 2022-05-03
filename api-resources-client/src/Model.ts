import { apiResources } from './ApiResources'
import { FieldJSONValue, FieldValue } from './field/Field'
import { Relation } from './field/Relation'
import { Type } from './type/Type'
import { enumerable } from './utils/enumerable'

export type ModelJSON = {
  [key: string]: FieldJSONValue | undefined
  type: string
  id?: string | null
}

type ModelAttributes = Record<string, unknown>

export type ModelConstructor = {
  new (): Model
  type: string,
  create (json: ModelJSON): Model,
  createForNew (fields?: ModelAttributes): Model
}

let ID: number = 0

export class Model {
  [index: string]: unknown,

  public static type: string = 'Model'

  public id: string | null = null
  public type: string

  @enumerable(false)
  public _ID: number = ++ID

  @enumerable(false)
  public _original?: Model | null = null

  @enumerable(false)
  public class: ModelConstructor

  public static getType (): Type {
    return apiResources.getType(this.type) as Type
  }

  public static create (json: ModelJSON): Model {
    const ModelClass = apiResources.getModelClass(json.type)
    const model = new ModelClass()
    model.deserialize(json)
    return model
  }

  public static createForNew (fields?: ModelAttributes): Model {
    const ModelType = this
    const model = new ModelType()

    const type: Type = this.getType()
    for (const [name, field] of Object.entries(type.getCreateFields())) {
      if (!fields || fields[name]) {
        model[name] = field.default()
      }
    }

    return model
  }

  constructor (type?: string) {
    this.class = this.constructor as ModelConstructor
    this.type = type || (this.constructor as ModelConstructor).type
  }

  public getType (): Type {
    return apiResources.getType(this.type) as Type
  }

  public deserialize (json: ModelJSON): void {
    const type: Type = apiResources.getType(json.type) as Type

    this.id = json.id || null
    this.type = type.name

    for (const [name, field] of Object.entries(type.getFields())) {
      if (json[name] !== undefined) {
        this[name] = field.deserialize(json[name]!)
      }

      if (field instanceof Relation && json['count_' + name] !== undefined) {
        this['count_' + name] = json['count_' + name]
      }
    }
  }

  public cloneForEdit (fields?: ModelAttributes): Model {
    const ModelClass = apiResources.getModelClass(this.type)
    const model = new ModelClass()
    model._original = this

    if (this.id) {
      model.id = this.id
    }

    const type: Type = apiResources.getType(this.type) as Type
    for (const [name, field] of Object.entries(type.getUpdateFields())) {
      if (!fields || fields[name]) {
        if (!this[name]) { // value not set, set default value
          model[name] = field.default()
        } else {
          if (this[name] instanceof Model) { // has one relation
            const relatedModel = this[name] as Model
            if (fields && fields[name]) { // clone related too
              const relatedFields = fields ? fields[name] : undefined
              model[name] = relatedModel.cloneForEdit(relatedFields as ModelAttributes)
            } else { // copy related
              model[name] = relatedModel
            }
          } else if (Array.isArray(this[name])) { // has many relation or array
            const relatedValues = this[name] as unknown[]
            const newRelatedValues: unknown[] = []
            relatedValues.forEach(rv => {
              if (rv instanceof Model) { // value is model
                if (fields && fields[name]) { // clone model too
                  const relatedFields = fields ? fields[name] : undefined
                  newRelatedValues.push(rv.cloneForEdit(relatedFields as ModelAttributes))
                  return
                }
              }
              newRelatedValues.push(rv) // copy value
            })
            model[name] = newRelatedValues
          } else {
            model[name] = this[name]
          }
        }
      }
    }

    return model
  }

  public serialize (fields?: ModelAttributes): ModelJSON {
    const json: ModelJSON = {
      type: this.type
    }

    if (this.id) {
      json.id = this.id
    }

    const type: Type = apiResources.getType(this.type) as Type
    const typeFields = this.id ? type.getUpdateFields() : type.getCreateFields()
    for (const [name, field] of Object.entries(typeFields)) {
      if (!fields || fields[name]) {
        json[name] = field.serialize(this[name] as FieldValue)
      }
    }

    return json
  }

  public equals (model?: Model): boolean {
    if (!model) {
      return false
    }

    return model.type === this.type && model.id === this.id
  }
}
