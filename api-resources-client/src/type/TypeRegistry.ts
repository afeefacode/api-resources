import { Type } from './Type'

class TypeRegistry {
  private _types: Record<string, Type> = {}

  public register (type: string, TypeClass: Type): void {
    this._types[type] = TypeClass
  }

  public get (type: string): Type | null {
    return this._types[type] || null
  }
}

export const typeRegistry = new TypeRegistry()

export function registerType (typeName: string, type: Type): void {
  return typeRegistry.register(typeName, type)
}

export function getType (typeName: string): Type | null {
  return typeRegistry.get(typeName)
}
