<template>
  <div>
    <p>URL {{ url }}</p>

    <a href="/">Backend</a>

    <h1>Articles</h1>

    <ul>
      <li
        v-for="article in articles"
        :key="article.id"
      >
        {{ article.id }} {{ article.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { Client } from '@afeefa/api-resources-client'

@Component
export default class App extends Vue {
  articles = []

  get url () {
    return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')
  }

  async created () {
    const result = await new Client().post('/backend-api', {
      resource: 'Example.Articles',
      action: 'get_articles'
    })
    this.articles = result.data
  }
}
</script>


<style lang="scss" scoped>
p {
  color: blue;
}
</style>
