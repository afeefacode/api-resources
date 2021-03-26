import { BaseRelation } from '../relations/BaseRelation'
import { DefaultRelation } from '../relations/DefaultRelation'
import { typeLoader } from '../TypeLoader'
import { DefaultValidator } from '../validators/DefaultValidator'

export class RelationType extends BaseRelation {
  constructor (config) {
    super()

    this.name = config.name
    this.title = config.title
    this.relation_type = config.relation_type
    this.related_type = config.related_type
    this.write_only = config.write_only
    this.validate = config.validate
  }

  createRelation () {
    const relation = new DefaultRelation()

    relation.name = this.name
    relation.title = this.title
    relation.relation_type = this.relation_type
    relation.related_type = this.related_type
    relation.write_only = this.write_only

    if (this.validate) {
      const validatorType = typeLoader.getValidatorType(this.validate.validator_type)
      const validator = validatorType.createValidator(this.title, this.validate)
      relation.validator = validator
    } else {
      relation.validator = new DefaultValidator()
    }

    return relation
  }
}
