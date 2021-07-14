import { Attribute } from '../Attribute'
import { FieldValue } from '../Field'

export class EnumAttribute extends Attribute {
  public static type: string = 'Afeefa.EnumAttribute'

  public default (): FieldValue {
    return null
  }
}
