<template>
  <v-app>
    <v-main>
      <v-container
        fluid
        class="px-8 py-4 px-sm-15 py-sm-10"
      >
        <a-vue />

        <p>URL {{ url }}</p>

        <a href="/">Backend</a>

        <router-link :to="{path: '/'}">
          Home
        </router-link>

        <router-link :to="{name: 'articles.list'}">
          Artikel
        </router-link>

        <router-link :to="{name: 'authors.list'}">
          Autoren
        </router-link>

        <router-link :to="{name: 'articles2.list'}">
          Artikel2
        </router-link>

        <router-link :to="{name: 'authors2.list'}">
          Autoren2
        </router-link>

        <p>
          <router-view />
        </p>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  get url () {
    return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')
  }
}
</script>


<style lang="scss" scoped>
a {
  margin-right: 1rem;
}
</style>
