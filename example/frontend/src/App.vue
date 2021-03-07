<template>
  <div>
    <p>URL {{ url }}</p>

    <a href="/">Backend</a>

    <h1>Tags</h1>

    <ul>
      <li
        v-for="tag in tags"
        :key="tag.id"
      >
        {{ tag.id }} {{ tag.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { Client } from '@afeefa/api-resources-client'

@Component
export default class App extends Vue {
  tags = []

  get url () {
    const url = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')
    return url
  }

  async created () {
    const client = new Client()
    const result = await client.get('/api')
    this.tags = result.data
  }
}
</script>


<style lang="scss" scoped>
p {
  color: red;
}
</style>
