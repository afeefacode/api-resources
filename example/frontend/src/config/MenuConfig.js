import ModelCount from '@a-admin/components/model/ModelCount'
import { apiResources } from '@afeefa/api-resources-client'
import { mdiAccount, mdiFileDocumentOutline } from '@mdi/js'

export class MenuConfig {
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
        action: apiResources.getAction({resource: 'ASYLBERATUNG.AppResource', action: 'get_counts'}),
        field: 'count_' + field
      }
    }
  }
}
