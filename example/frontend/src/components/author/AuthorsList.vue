<template>
  <list-view
    v-bind="$attrs"
    :action="action"
    :fields="fields"
    :filters.sync="filters"
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

    <template #model="{ model: author }">
      <list-card>
        <list-meta>
          Autor #{{ author.id }}
          |
          {{ author.count_articles }} Artikel
        </list-meta>

        <list-title :link="author.getLink()">
          {{ author.name }}
        </list-title>

        <tag-list
          :model="author"
          @clickTag="clickTag"
        />
      </list-card>
    </template>
  </list-view>
</template>


<script>
import { Author } from '@/models'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AuthorsList extends Vue {
  static getListConfig (route) {
    return {
      action: Author.getAction(route.meta.routeDefinition, 'get_authors'),

      fields: {
        name: true,
        tags: {
          name: true,
          count_users: true
        },
        count_articles: true
      }
    }
  }

  filters = []

  get action () {
    return AuthorsList.getListConfig(this.$route).action
  }

  get fields () {
    return AuthorsList.getListConfig(this.$route).fields
  }

  clickTag (tag) {
    this.filters.tag_id.value = tag.id
  }
}
</script>
