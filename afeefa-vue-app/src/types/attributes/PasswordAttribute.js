import { BaseAttribute } from './BaseAttribute'

export class PasswordAttribute extends BaseAttribute {
  init (value) {
    return value || ''
  }
}
