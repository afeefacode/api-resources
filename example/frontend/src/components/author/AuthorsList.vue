<template>
  <list-page :Model="Author">
    <list-view
      v-bind="$attrs"
      :listViewRequest="listViewRequest"
    >
      <template #filters>
        <list-filter-row>
          <list-filter-search />

          <list-filter-select
            name="tag_id"
            label="Tag"
            maxWidth="200"
          />
        </list-filter-row>

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
import { ListViewRequest } from '@a-vue/components/list/ListViewRequest'

function getListViewRequest () {
  return new ListViewRequest()
    .action({
      resource: 'Example.AuthorResource',
      action: 'get_authors'
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
  static listViewRequest = getListViewRequest()

  Author = Author
  listViewRequest = getListViewRequest()
}
</script>
