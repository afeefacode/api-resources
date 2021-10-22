import ModelCount from '@a-admin/components/model/ModelCount'
import { mdiAccount, mdiFileDocumentOutline } from '@mdi/js'

export class MenuConfig {
  constructor (routeDefinition) {
    this.api = routeDefinition.config.api
  }

  get items () {
    return [
      {
        title: 'Artikel',
        to: {
          name: 'articles.list'
        },
        icon: mdiFileDocumentOutline,
        iconColor: 'yellow darken-3'
      },

      {
        title: 'Autor:innen',
        to: {
          name: 'authors.list'
        },
        icon: mdiAccount,
        iconColor: 'yellow darken-3'
      }
    ]
  }

  getBadge (field) {
    return {
      component: ModelCount,
      props: {
        action: this.api.getAction('ASYLBERATUNG.AppResource', 'get_counts'),
        field: 'count_' + field
      }
    }
  }
}
