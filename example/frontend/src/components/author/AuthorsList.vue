<template>
  <list-view
    v-bind="$attrs"
    :filters.sync="filters"
  >
    <template #filters>
      <list-filter-row>
        <v-col cols="3">
          <list-filter name="tag_id" />
        </v-col>

        <list-filter-row>
          <list-filter-search />
        </list-filter-row>

        <v-col cols="3">
          <list-filter name="order" />
        </v-col>
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
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AuthorsList extends Vue {
  filters = []

  get action () {
    return this.$routeDefinition.config.routing.list.action
  }

  get fields () {
    return this.$routeDefinition.config.routing.list.fields
  }

  clickTag (tag) {
    this.filters.tag_id.value = tag.id
  }
}
</script>
