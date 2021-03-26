import { apiClient } from '../api2/ApiClient'
import { Model } from './Model'
import FilterType from './types/FilterType'
import ModelType from './types/ModelType'
import ValidatorType from './types/ValidatorType'

class TypeLoader {
  modelTypes = {}
  validatorTypes = {}
  filterTypes = {}

  async load (modelClasses = []) {
    const types = await apiClient.loadTypes()

    types.filter_types.forEach(f => { // create filters and validators before model
      this.filterTypes[f.filter_type] = new FilterType(f)
    })

    types.validator_types.forEach(v => {
      this.validatorTypes[v.validator_type] = new ValidatorType(v)
    })

    types.model_types.forEach(m => {
      const CustomClass = modelClasses.find(C => C.type === m.type)
      const Class = CustomClass || Model

      m.Class = Class
      const modelType = new ModelType(m)

      if (CustomClass) {
        Class.modelType = modelType
      }

      this.modelTypes[m.type] = modelType
    })
  }

  getModelType (type) {
    return this.modelTypes[type]
  }

  getValidatorType (validatorType) {
    return this.validatorTypes[validatorType]
  }

  getFilterType (filterType) {
    return this.filterTypes[filterType]
  }
}

export const typeLoader = new TypeLoader()
