import { Attribute } from '../Attribute'
import { FieldValue } from '../Field'

export class StringAttribute extends Attribute {
  public static type: string = 'Afeefa.StringAttribute'

  public default (): FieldValue {
    return ''
  }
}
