<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
    >
      <div class="pt-8 pl-8 d-flex align-start flex-column">
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </div>

      <app-menu />
    </v-navigation-drawer>

    <v-main>
      <v-container
        fluid
        class="pa-8"
      >
        <v-app-bar-nav-icon
          v-if="!drawer"
          class=" mb-8"
          @click="drawer = !drawer"
        />

        <breadcrumbs />

        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import AppMenu from './Menu'
import Breadcrumbs from './Breadcrumbs'

@Component({
  components: {
    AppMenu,
    Breadcrumbs
  }
})
export default class App extends Vue {
  drawer = true
}
</script>


<style lang="scss" scoped>
.breadcrumbs {
  margin-bottom: 2rem;
}
</style>
