import { Attribute } from '../Attribute'
import { FieldValue } from '../Field'

export class TextAttribute extends Attribute {
  public static type: string = 'Afeefa.TextAttribute'

  public default (): FieldValue {
    return ''
  }
}
