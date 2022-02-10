import { Attribute } from '../Attribute'
import { FieldValue } from '../Field'

export class BooleanAttribute extends Attribute {
  public static type: string = 'Afeefa.BooleanAttribute'

  public fallbackDefault (): FieldValue {
    return false
  }
}
