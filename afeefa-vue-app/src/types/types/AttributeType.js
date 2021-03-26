import { BaseAttribute } from '../attributes/BaseAttribute'
import { PasswordAttribute } from '../attributes/PasswordAttribute'
import { VarcharAttribute } from '../attributes/VarcharAttribute'
import { typeLoader } from '../TypeLoader'
import { DefaultValidator } from '../validators/DefaultValidator'

export class AttributeType extends BaseAttribute {
  constructor (config) {
    super()

    this.name = config.name
    this.title = config.title
    this.attribute_type = config.attribute_type
    this.write_only = config.write_only
    this.validate = config.validate
    this.is_computed = config.is_computed
  }

  createAttribute () {
    let attribute

    switch (this.attribute_type) {
      case 'Kollektiv\\Varchar':
        attribute = new VarcharAttribute()
        break
      case 'Kollektiv\\Password':
        attribute = new PasswordAttribute()
        break
    }

    if (!attribute) {
      console.error('There is no attribute of class', this.attribute_type)
    }

    attribute.name = this.name
    attribute.title = this.title
    attribute.attribute_type = this.attribute_type
    attribute.write_only = this.write_only

    if (this.validate) {
      const validatorType = typeLoader.getValidatorType(this.validate.validator_type)
      const validator = validatorType.createValidator(this.title, this.validate)
      attribute.validator = validator
    } else {
      attribute.validator = new DefaultValidator()
    }

    attribute.is_computed = this.is_computed

    return attribute
  }
}
