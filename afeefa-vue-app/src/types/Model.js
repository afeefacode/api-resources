export class Model {
  $attributes = {}
  $relations = {}
  $data = {}

  constructor () {
    Object.defineProperty(this, '$attributes', {
      enumerable: false
    })
    Object.defineProperty(this, '$relations', {
      enumerable: false
    })
    Object.defineProperty(this, '$data', {
      enumerable: false
    })
  }

  serialize () {
    const data = {}

    Object.values(this.$attributes).forEach(attribute => {
      data[attribute.name] = this[attribute.name]
    })

    Object.values(this.$relations).forEach(relation => {
      const related = this[relation.name]
      if (related) {
        if (relation.relation_type === 'Kollektiv\\HasOne') {
          data[relation.name] = related.serialize()
        }

        if (relation.relation_type === 'Kollektiv\\BelongsTo') {
          data[relation.name] = {
            id: related.id
          }
        }
      } else {
        data[relation.name] = null
      }
    })

    return data
  }
}
