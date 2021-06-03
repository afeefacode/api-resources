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
      <a-loading-indicator :isLoading="isLoading" />

      <v-container
        fluid
        class="pa-8"
      >
        <v-app-bar-nav-icon
          v-if="!drawer"
          class=" mb-8"
          @click="drawer = !drawer"
        />

        <a-breadcrumbs />

        <router-view />
      </v-container>
    </v-main>

    <a-dialog />
    <a-alert />
    <a-save-indicator />
  </v-app>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import AppMenu from './Menu'
import { LoadingEvent } from '@a-vue/events'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])

@Component({
  components: {
    AppMenu
  }
})
export default class App extends Vue {
  drawer = true
  isLoading = false

  created () {
    this.$events.on(LoadingEvent.START_LOADING, this.startLoading)
    this.$events.on(LoadingEvent.STOP_LOADING, this.stopLoading)
  }

  startLoading () {
    this.isLoading = true
  }

  stopLoading () {
    this.isLoading = false
  }
}
</script>


<style lang="scss" scoped>
.breadcrumbs {
  margin-bottom: 2rem;
}
</style>
