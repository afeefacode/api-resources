import { Validator } from './Validator'

class ValidatorRegistry {
  private _validators: Record<string, Validator> = {}

  public register (type: string, validator: Validator): void {
    this._validators[type] = validator
  }

  public get (type: string): Validator | null {
    return this._validators[type] || null
  }
}

export const validatorRegistry = new ValidatorRegistry()

export function registerValidator (type: string, validator: Validator): void {
  return validatorRegistry.register(type, validator)
}

export function getValidator (type: string): Validator | null {
  return validatorRegistry.get(type)
}
