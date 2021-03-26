export class BaseValidator {
  fieldName = null
  rules = []

  getRules () {
    return []
  }

  getRule (name) {
    return this.rules.find(r => r.name === name)
  }

  getRuleParam (name) {
    const rule = this.getRule(name)
    return rule && rule.param
  }

  getValidationMessage (name, params = {}) {
    const rule = this.getRule(name)
    params.fieldName = this.fieldName
    params.param = rule.param

    return rule.message.replace(/{{\s*(\w+)\s*}}/g, function (m, m1) {
      return params[m1] || m
    })
  }
}
