import { Attribute } from '../Attribute.js'
import { FieldValue } from '../Field.js'

export class SetAttribute extends Attribute {
  public static type: string = 'Afeefa.SetAttribute'

  protected fallbackDefault (): FieldValue {
    return []
  }
}
