import ModelCount from '@a-admin/components/model/ModelCount'
import { mdiCogOutline, mdiHome } from '@mdi/js'

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
        icon: mdiHome,
        iconColor: 'green'
      },

      {
        title: 'Autoren',
        to: {
          name: 'authors.list'
        },
        icon: mdiCogOutline,
        iconColor: 'gray'
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
