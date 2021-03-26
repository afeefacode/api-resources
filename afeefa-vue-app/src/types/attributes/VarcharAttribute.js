import { BaseAttribute } from './BaseAttribute'

export class VarcharAttribute extends BaseAttribute {
  init (value) {
    return value || ''
  }
}
