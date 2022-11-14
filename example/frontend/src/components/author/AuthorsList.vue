<template>
  <list-page :Model="Author">
    <list-view
      v-bind="$attrs"
      :listViewConfig="listViewConfig"
    >
      <template #filters>
        <a-row>
          <list-filter-search />

          <list-filter-select
            name="tag_id"
            label="Tag"
            maxWidth="200"
          />
        </a-row>

        <list-filter-page />
      </template>

      <template #header-table>
        <list-column-header
          text="Name"
          order="name"
        />

        <list-column-header
          text="Artikel"
          order="count_articles"
        />

        <div>Tags</div>
      </template>

      <template #model-table="{ model: author, setFilter }">
        <div>
          <router-link :to="author.getLink()">
            {{ author.name }}
          </router-link>
        </div>

        <div class="info">
          {{ author.count_articles }}
        </div>

        <div>
          <tag-list
            :model="author"
            @clickTag="setFilter('tag_id', $event.id)"
          />
        </div>
      </template>
    </list-view>
  </list-page>
</template>


<script>
import { Author } from '@/models'
import { Component, Vue } from 'vue-property-decorator'
import { ListViewConfig } from '@afeefa/api-resources-client'

function getListViewConfig () {
  return new ListViewConfig()
    .action({
      resourceType: 'Example.AuthorResource',
      actionName: 'get_authors'
    })
    .fields({
      name: true,
      tags: {
        name: true,
        count_users: true
      },
      count_articles: true
    })
}

@Component
export default class AuthorsList extends Vue {
  static getListRouteConfig () {
    return getListViewConfig()
  }

  Author = Author
  listViewConfig = getListViewConfig()
}
</script>
