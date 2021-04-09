<template>
  <v-container class="pl-8 d-flex flex-column">
    <a href="/">Backend</a>

    <router-link :to="{name: 'root'}">
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
  </v-container>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AppMenu extends Vue {
}
</script>
