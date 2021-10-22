<template>
  <list-page
    v-bind="$attrs"
    :table="true"
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

    <template #header>
      <list-column-header
        text="ID"
        order="id"
      />

      <list-column-header
        text="Name"
        order="name"
      />

      <div>Artikel</div>

      <div>Tags</div>
    </template>

    <template #model="{ model: author }">
      <div>{{ author.id }}</div>

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
          @clickTag="clickTag"
        />
      </div>
    </template>
  </list-page>
</template>


<script>
import { Author } from '@/models'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AuthorsList extends Vue {
  static getListConfig (route) {
    return {
      ModelClass: Author,

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
