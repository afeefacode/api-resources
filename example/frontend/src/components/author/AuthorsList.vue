<template>
  <list-page :ModelClass="Author">
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

      <template #model-table="{ model: author }">
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
    </list-view>
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

      action: Author.getAction('get_authors'),

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

  Author = Author

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
