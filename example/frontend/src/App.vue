<template>
  <div v-if="isLoading">
    Loading
  </div>
  <v-app v-else>
    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
    >
      <div class="pa-8 d-flex align-start flex-column">
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </div>

      <v-container class="pa-8 d-flex flex-column">
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
        <a-vue />

        <widget />

        <p>URL {{ url }}</p>

        <h3>App</h3>
        <ul>
          <li>Config: {{ $routeConfig }}</li>
          <li>{{ $routeDefinition.fullId }}</li>
          <li>{{ $routeDefinition.fullName }}</li>
          <li>{{ $routeDefinition.fullPath }}</li>
        </ul>

        <h3>Parent Paths:</h3>

        <ul>
          <li
            v-for="path in paths"
            :key="path"
          >
            {{ path }}
          </li>
        </ul>

        <h3>Parents:</h3>

        <ul>
          <li
            v-for="definition in definitions"
            :key="definition"
          >
            {{ definition }}
          </li>
        </ul>

        <p>
          <router-view />
        </p>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import Widget from './components/Widget'
import apiResources from './config/api'

@Component({
  components: {
    Widget
  }
})
export default class App extends Vue {
  drawer = true
  isLoading = true

  get url () {
    return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')
  }

  get paths () {
    const definition = this.$route.meta.routeDefinition
    return definition.getParentPathDefinitions().map(d => d.fullId)
  }

  get definitions () {
    const definition = this.$route.meta.routeDefinition
    return definition.getParentDefinitions().map(d => d.fullId)
  }

  async created () {
    // console.log(this.$route.meta, this.$attrs)
    // console.log(this.$route.matched)
    console.log(this.$routeDefinition.config.api)

    await apiResources.loaded()
    this.isLoading = false
  }
}
</script>


<style lang="scss" scoped>
a {
  margin-right: 1rem;
}
</style>
