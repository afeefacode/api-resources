<template>
  <div>
    <widget />

    <h3>List</h3>
    <ul>
      <li>Config: {{ $routeConfig }}</li>
      <li>{{ $routeDefinition.fullId }}</li>
      <li>{{ $routeDefinition.fullName }}</li>
      <li>{{ $routeDefinition.fullPath }}</li>
    </ul>

    <h1>Articles</h1>

    <v-text-field
      v-model="keyword"
      label="Suche"
      title="Suche"
    />

    <v-pagination
      v-if="articles.length"
      v-model="page"
      :length="numPages"
      :total-visible="8"
      @input="pageChanged"
    />

    <ul>
      <li
        v-for="article in articles"
        :key="article.id"
      >
        <router-link :to="{name: 'articles.detail', params: { articleId: article.id }}">
          Artikel
        </router-link>

        <div class="meta">
          # {{ article.id }} | Am {{ article.date }}
        </div>
        <div class="author">
          {{ article.author.name }}
        </div>
        <div class="title">
          {{ article.title }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { Component, Watch, Vue } from 'vue-property-decorator'
import Widget from '../Widget.vue'
import { Api, Client } from '@afeefa/api-resources-client'

@Component({
  components: {
    Widget
  }
})
export default class List extends Vue {
  articles = []
  meta = {}
  keyword = null
  page = 1


  @Watch('keyword')
  keywordChanged () {
    this.page = 1
    this.load()
  }

  get numPages () {
    return Math.ceil(this.meta.count_search / 15)
  }

  pageChanged () {
    this.load()
  }

  created () {
    this.load()
  }

  async load () {
    // console.log(this.$routeConfig)
    // console.log(this.$routeConfig.api.request())

    // const {data, meta} = client
    //   .action('Example.ArticlesResource::get_articles')
    //   .fields({
    //     title: true,
    //     date: true,
    //     author: {
    //       name: true
    //     }
    //   })
    //   .filters({
    //     keyword: this.keyword,
    //     page: {
    //       page: this.page,
    //       pageSize: 15
    //     }
    //   })
    //   .run()


    // const Resource = this.$routeConfig.Resource
    // const resource = new Resource()
    // console.log(Resource)
    const result = await new Client().post('/backend-api', {
      resource: 'Example.ArticlesResource',
      action: 'get_articles',
      fields: {
        title: true,
        date: true,
        author: {
          name: true
        }
      },
      filters: {
        keyword: this.keyword,
        page: {
          page: this.page,
          pageSize: 15
        }
      }
    })
    this.articles = result.data.data
    this.meta = result.data.meta
  }
}
</script>


<style lang="scss" scoped>
.meta {
  color: gray;
  font-size: .7rem;
}

.author {
  font-size: .9rem;
}

.title {
  font-weight: bold;
}
</style>
