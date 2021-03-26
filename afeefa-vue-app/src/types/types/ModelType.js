// import { Model } from '../Model'
import { typeLoader } from '../TypeLoader'
import { AttributeType } from './AttributeType'
import { RelationType } from './RelationType'

export default class ModelType {
  Class = null
  type = null
  translations = []
  attributeTypes = {}
  relationTypes = {}
  filters = {}

  constructor (config) {
    this.Class = config.Class
    this.type = config.type
    this.translations = config.translations

    this.attributeTypes = config.attributes.map(a => new AttributeType(a))
    this.relationTypes = config.relations.map(r => new RelationType(r))

    this.filters = config.filters.map(f => {
      const filterType = typeLoader.getFilterType(f.filter_type)
      return filterType.createFilter(f)
    })
  }

  createModel (data = {}) {
    const model = new this.Class()
    model.$data = data

    model.$attributes = this.attributeTypes.reduce(function (map, attributeType) {
      map[attributeType.name] = attributeType.createAttribute()
      return map
    }, {})

    model.$relations = this.relationTypes.reduce(function (map, relationType) {
      map[relationType.name] = relationType.createRelation()
      return map
    }, {})

    model.id = data.id || null
    model.type = this.type

    this.attributeTypes.forEach(a => {
      const attribute = model.$attributes[a.name]
      const value = attribute.init(data[a.name])
      model[a.name] = value
    })

    this.relationTypes.forEach(r => {
      const modelType = typeLoader.getModelType(r.related_type)

      let related

      // TODO init empty related model only if relation.validator.min > 0
      if (!data[r.name] && r.relation_type === 'Kollektiv\\HasOne') {
        related = modelType.createModel()
      } else {
        related = data[r.name] ? modelType.createModel(data[r.name]) : null
      }

      model[r.name] = related
    })

    return model
  }

  resetModel (model) {
    return this.createModel(model.$data)
  }

  getTranslation (key) {
    return this.translations.de[key]
  }

  getFilters () {
    return this.filters
  }

  getDefaultQueryAttributes () {
    const fields = []

    const attributes = this.attributeTypes
    attributes.forEach(a => {
      if (!a.write_only) {
        fields.push(a.name)
      }
    })

    const relations = this.relationTypes
    relations.forEach(r => {
      const relatedType = typeLoader.getModelType(r.related_type)
      if (!r.write_only) {
        fields.push({
          [r.name]: relatedType.getDefaultQueryAttributes()
        })
      }
    })

    return fields
  }
}
