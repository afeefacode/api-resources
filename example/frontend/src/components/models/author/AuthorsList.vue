<template>
  <list-view
    :config="config"
    :filters.sync="filters"
    :count.sync="count"
  >
    <template #filters>
      <v-row>
        <v-col cols="3">
          <list-filter name="tag_id" />
        </v-col>

        <v-col cols="3">
          <list-filter name="q" />
        </v-col>

        <v-col cols="3">
          <list-filter name="page_size" />
        </v-col>

        <v-col cols="3">
          <list-filter name="order" />
        </v-col>
      </v-row>

      <v-row>
        <list-filter
          name="page"
          :count="count"
          :page_size="filters.page_size.value"
        />
      </v-row>
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
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AuthorsList extends Vue {
  filters = []
  count = 0

  get config () {
    const api = this.$routeDefinition.config.api

    return {
      listId: this.listId,

      filterSource: 'route',

      action: api.getAction('Example.AuthorsResource', 'get_authors'),

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

  clickTag (tag) {
    this.filters.tag_id.value = tag.id
  }
}
</script>
