import { Attribute } from '../Attribute.js'
import { FieldValue } from '../Field.js'

export class BooleanAttribute extends Attribute {
  public static type: string = 'Afeefa.BooleanAttribute'

  protected fallbackDefault (): FieldValue {
    return false
  }

  public deserialize (value: unknown): boolean {
    return !!value
  }
}
