import { Attribute } from '../Attribute'
import { FieldJSONValue, FieldValue } from '../Field'

export class DateAttribute extends Attribute {
  public static type: string = 'Afeefa.DateAttribute'

  public deserialize (value: string): Date {
    return new Date(value)
  }

  public serialize (value: FieldValue): FieldJSONValue {
    return value as FieldJSONValue
  }
}
