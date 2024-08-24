import { Attribute } from '../Attribute'
import { FieldValue } from '../Field'

export class SetAttribute extends Attribute {
  public static type: string = 'Afeefa.SetAttribute'

  protected fallbackDefault (): FieldValue {
    return []
  }
}
