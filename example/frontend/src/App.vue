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
        <a-vue />

        <widget />

        <p>URL {{ url }}</p>

        <h3>App</h3>
        <ul>
          <li>Config: {{ Object.keys($routeConfig) }}</li>
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
import AppMenu from './components/Menu'

@Component({
  components: {
    AppMenu,
    Widget
  }
})
export default class App extends Vue {
  drawer = true

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
    // console.log(this.$attrs)
    // console.log(this.$route.meta, this.$attrs)
    // console.log(this.$route.matched)
    // console.log(this.$routeDefinition.config.api)
  }
}
</script>


<style lang="scss" scoped>
a {
  margin-right: 1rem;
}
</style>
