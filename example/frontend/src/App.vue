<template>
  <v-app>
    <v-main>
      <v-container
        fluid
        class="px-8 py-4 px-sm-15 py-sm-10"
      >
        TestView: <router-view />

        <a-vue />

        <p>URL {{ url }}</p>

        <a href="/">Backend</a>

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
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Client } from '@afeefa/api-resources-client'

@Component
export default class App extends Vue {
  articles = []
  meta = {}
  keyword = null
  page = 1

  get url () {
    return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')
  }

  @Watch('keyword')
  keywordChanged () {
    this.page = 1
    this.load()
  }

  get numPages () {
    console.log('get num pages', this.meta, Math.ceil(this.meta.count_search / 15))
    return Math.ceil(this.meta.count_search / 15)
  }

  pageChanged () {
    this.load()
  }

  async created () {
    this.load()
  }

  async load () {
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
