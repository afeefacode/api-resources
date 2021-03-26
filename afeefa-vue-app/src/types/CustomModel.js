import { Model } from './Model'

export class CustomModel extends Model {
  static modelType = null

  static getTranslation (key) {
    return this.modelType.getTranslation(key)
  }

  static getFilters () {
    return this.modelType.getFilters()
  }

  static create (data = {}) {
    return this.modelType.createModel(data)
  }

  static reset (model) {
    return this.modelType.resetModel(model)
  }

  static getDefaultQueryAttributes () {
    return this.modelType.getDefaultQueryAttributes()
  }
}
