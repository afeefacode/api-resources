import { Model } from '@a-admin/models/Model'
import { mdiTag } from '@mdi/js'

export class Tag extends Model {
  static type = 'Example.TagType'

  static icon = {
    icon: mdiTag,
    color: 'grey'
  }

  getTitle () {
    return this.name
  }
}
