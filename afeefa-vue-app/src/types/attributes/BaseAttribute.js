export class BaseAttribute {
  name = null
  title = null
  attribute_type = null
  write_only = false
  validator = null
  is_computed = false

  init (value) {
    return value
  }
}
