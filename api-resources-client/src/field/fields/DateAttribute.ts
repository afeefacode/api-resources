import { Attribute } from '../Attribute'
import { FieldJSONValue, FieldValue } from '../Field'

export class DateAttribute extends Attribute {
  public static type: string = 'Afeefa.DateAttribute'

  public deserialize (value: string | null): Date | null {
    if (value) {
      return new Date(value)
    }
    return null
  }

  public serialize (value: FieldValue): FieldJSONValue {
    return value as FieldJSONValue
  }
}
