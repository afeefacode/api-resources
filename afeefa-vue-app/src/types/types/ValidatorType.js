import { BelongsToValidator } from '../validators/BelongsToValidator'
import { HasOneValidator } from '../validators/HasOneValidator'
import { VarcharValidator } from '../validators/VarcharValidator'

export default class ValidatorType {
  validator_type = null
  rules = []

  constructor (config) {
    this.validator_type = config.validator_type
    this.rules = config.rules
  }

  createValidator (fieldName, data) {
    let validator

    switch (this.validator_type) {
      case 'Kollektiv\\Varchar':
      case 'Kollektiv\\Password':
        validator = new VarcharValidator()
        break
      case 'Kollektiv\\HasOne':
        validator = new HasOneValidator()
        break
      case 'Kollektiv\\BelongsTo':
        validator = new BelongsToValidator()
        break
    }

    if (!validator) {
      console.error('There is no validator of class', this.validator_type)
    }

    validator.fieldName = fieldName

    this.rules.forEach(globalRule => {
      let localRule = this.getRule(data.rules, globalRule.name)
      if (localRule) {
        localRule = {
          ...globalRule,
          ...localRule
        }
        validator.rules.push(localRule)
      }
    })

    return validator
  }

  getRule (rules, name) {
    return rules.find(r => r.name === name)
  }
}
