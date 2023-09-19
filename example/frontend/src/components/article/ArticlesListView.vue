<template>
  <list-view
    v-bind="$attrs"
    :listViewConfig="listViewConfig"
  >
    <template #filters>
      <a-row>
        <list-filter-search />

        <list-filter-select
          v-if="$has.author"
          name="author_id"
          label="Autor"
          maxWidth="200"
        />

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
        text="Datum"
        order="date"
      />

      <list-column-header
        text="Title"
        order="title"
      />

      <list-column-header
        v-if="$has.author"
        text="Autor"
      />

      <list-column-header
        text="KOMMENTARE"
        order="count_comments"
      />

      <div>Tags</div>
    </template>

    <template #model-table="{ model: article, setFilter }">
      <div class="text--info">
        {{ date(article) }}
      </div>

      <div>
        <router-link :to="article.getLink()">
          {{ article.title }}
        </router-link>
      </div>

      <div v-if="$has.author">
        <a
          href=""
          @click.prevent="setFilter('author_id', article.author.id)"
        >{{ article.author.name }}</a>
      </div>

      <div class="text--info">
        {{ article.count_comments }}
      </div>

      <div>
        <tag-list
          :model="article"
          @clickTag="setFilter('tag_id', $event.id)"
        />
      </div>
    </template>
  </list-view>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'
import { ListViewConfig } from '@afeefa/api-resources-client'

export function getListViewConfig (authorId) {
  return new ListViewConfig()
    .action({
      resourceType: 'Example.ArticleResource',
      actionName: 'get_articles'
    })
    .params({
      author_id: authorId
    })
    .fields({
      title: true,
      date: true,
      author: {
        name: true
      },
      tags: {
        name: true,
        count_users: true
      },
      count_comments: true
    })
}

@Component({
  props: ['author_id']
})
export default class ArticlesListView extends Vue {
  $hasOptions = ['author']

  listViewConfig = getListViewConfig(this.author_id)

  date (article) {
    if (!article.date) {
      return ''
    }

    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    return article.date.toLocaleDateString('de-DE', options)
  }
}
</script>
