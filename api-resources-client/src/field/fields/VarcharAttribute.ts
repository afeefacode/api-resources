import { Attribute } from '../Attribute'
import { FieldValue } from '../Field'

export class VarcharAttribute extends Attribute {
  public static type: string = 'Afeefa.VarcharAttribute'

  public default (): FieldValue {
    return ''
  }
}
