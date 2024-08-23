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

export type ModelAttributes = {
  [key: string]: ModelAttributes | true
}

export type ModelData = {
  [key: string]: FieldValue | undefined
  type?: string
  id?: string | null
}

export type ModelConstructor = {
  new (data?: ModelData): Model
  new (type: string, data?: ModelData): Model
  type: string
  getType (): Type
  fromJson (json: ModelJSON): Model
  create (data?: ModelData): Model
}

let ID: number = 0

export class Model {
  [index: string]: unknown,

  public static type: string = 'Model'

  public id: string | null = null
  public type: string = 'Model'

  @enumerable(false)
  public _ID: number = ++ID

  @enumerable(false)
  public _original?: Model | null = null

  @enumerable(false)
  public class: ModelConstructor

  public static getType (): Type {
    return apiResources.getType(this.type) as Type
  }

  /**
   * Deserializes a server response json.
   */
  public static fromJson (json: ModelJSON): Model {
    let model
    if (json.type) {
      const ModelClass = apiResources.getModelClass(json.type)
      model = new ModelClass()
    } else {
      model = new this()
      json.type = this.type
    }
    model.deserialize(json)
    return model
  }

  /**
   * Creates a new instance while setting all create fields to a default value.
   */
  public static defaults (data?: ModelData): Model {
    const model = new this()

    const type: Type = this.getType()
    for (const [name, field] of Object.entries(type.getCreateFields())) {
      model[name] = field.default()
    }

    if (data) {
      model.fill(data)
    }

    return model
  }

  constructor(data?: ModelData)
  constructor(type: string, data?: ModelData)
  constructor (...args: any[]) {
    this.class = this.constructor as ModelConstructor

    // type and data
    if (args.length === 2) {
      this.type = args[0] as string
      this.fill(args[1])
    // type or data
    } else if (args.length === 1) {
      if (typeof args[0] === 'string') {
        this.type = args[0]
      } else {
        this.type = this.class.type
        this.fill(args[0])
      }
    // no type no data
    } else {
      this.type = this.class.type
    }
  }

  /**
   * Deletes all model attributes not included in fields.
   */
  public withOnly (fields?: ModelAttributes): Model {
    for (const name of Object.keys(this)) {
      if (name === 'id' || name === 'type') {
        continue
      }
      if (!fields?.[name]) {
        delete this[name]
      }
    }

    return this
  }

  /**
   * Deletes all model attributes included in fields.
   */
  public without (fields?: ModelAttributes): Model {
    for (const name of Object.keys(this)) {
      if (fields?.[name]) {
        delete this[name]
      }
    }

    return this
  }

  /**
   * Fills the model.
   */
  public fill (data: ModelData): Model {
    for (const [key, value] of Object.entries(data)) {
      this[key] = value
    }

    return this
  }

  /**
   * Returns the Type-instance associated to this model.
   */
  public getType (): Type {
    return apiResources.getType(this.type) as Type
  }

  /**
   * Initializes the model with the given json data.
   */
  public deserialize (json: ModelJSON): void {
    const type: Type = apiResources.getType(json.type) as Type

    this.id = json.id || null
    this.type = type.name

    for (const [name, field] of Object.entries(type.getFields())) {
      if (json[name] !== undefined) {
        this[name] = field.deserialize(json[name]!)
      } else {
        this[name] = field.default() // set a default value
      }

      if (field instanceof Relation && json['count_' + name] !== undefined) {
        this['count_' + name] = json['count_' + name]
      }
    }
  }

  public clone (relationsToClone?: ModelAttributes): Model {
    const ModelClass = apiResources.getModelClass(this.type)
    const model = new ModelClass()
    model._original = this

    if (this.id) {
      model.id = this.id
    }

    // copy / clone from original

    for (const [name, value] of Object.entries(this)) {
      const nestedRelationsToClone = typeof relationsToClone?.[name] === 'object' ? relationsToClone[name] as ModelAttributes : undefined

      if (value instanceof Model) { // has one relation
        const relatedModel = value
        if (relationsToClone?.[name]) { // clone related too
          // console.log('one-relation', relatedModel, relationsToClone[name], relatedModel.clone(relationsToClone[name] as ModelAttributes))
          model[name] = relatedModel.clone(nestedRelationsToClone)
        } else { // copy related
          // console.log('one-relation-copy', relatedModel)
          model[name] = relatedModel
        }
      } else if (Array.isArray(value)) { // has many relation or array
        const relatedValues = value as unknown[]
        const newRelatedValues: unknown[] = []
        relatedValues.forEach(rv => {
          if (rv instanceof Model && relationsToClone?.[name]) { // value is model to be also cloned
            // console.log('many-relation', rv, relationsToClone[name], rv.clone(relationsToClone[name] as ModelAttributes))
            newRelatedValues.push(rv.clone(nestedRelationsToClone))
          } else {
            // console.log('many-relation-copy', rv)
            newRelatedValues.push(rv) // copy value
          }
        })
        model[name] = newRelatedValues
      } else { // any other value gets copied
        // console.log('value-copy', this, name)
        model[name] = value
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
      if (!fields || fields[name]) { // serialize all allowed fields (or only given ones of them, if specific fields are given)
        if (this.hasOwnProperty(name) && this[name] !== undefined) {
          json[name] = field.serialize(this[name] as FieldValue, fields?.[name])
        }
      }
    }

    // check all given fields are allowed to update/create
    if (fields) {
      for (const name of Object.keys(fields)) {
        if (fields[name] && !typeFields[name]) { // ignore false fields
          console.warn(`Field "${name}" not configured for type ${this.type}#${this.id ? 'update' : 'create'}`)
        }
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
