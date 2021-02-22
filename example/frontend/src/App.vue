<template>
  <div>
    <h1>Tags</h1>

    <ul>
      <li
        v-for="tag in tags"
        :key="tag.id"
      >
        {{ tag.id }} {{ tag.name }}
      </li>
    </ul>

    <a href="/">Backend</a>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { Client } from '@afeefa/api-resources-client'

@Component
export default class App extends Vue {
  tags = []

  async created () {
    const client = new Client()
    const result = await client.get('http://localhost:8080/api')
    this.tags = result.data
  }
}
</script>


<style lang="scss" scoped>
p {
  color: red;
}
</style>
