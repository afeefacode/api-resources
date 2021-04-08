import { Field } from './Field'

class FieldRegistry {
  private _fields: Record<string, typeof Field> = {}

  public register (type: string, FieldClass: typeof Field): void {
    this._fields[type] = FieldClass
  }

  public get (type: string): typeof Field | null {
    return this._fields[type] || null
  }
}

export const fieldRegistry = new FieldRegistry()

export function registerField (type: string, FieldClass: typeof Field): void {
  return fieldRegistry.register(type, FieldClass)
}

export function getField (type: string): typeof Field | null {
  return fieldRegistry.get(type)
}
