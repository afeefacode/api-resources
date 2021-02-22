<template>
  <div>
    <p>
      Frontend
    </p>

    <p>
      Data: {{ data }}
    </p>

    <a href="/">Backend</a>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { Client } from '@afeefa/api-resources-client'

@Component
export default class App extends Vue {
  data = null

  created () {
    const client = new Client()
    this.data = client.get()
  }
}
</script>


<style lang="scss" scoped>
p {
  color: red;
}
</style>
