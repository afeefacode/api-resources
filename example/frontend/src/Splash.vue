<template>
  <v-app>
    <v-container class="pa-8 d-flex align-center">
      <v-progress-circular
        indeterminate
        color="red"
      />
      <div class="ml-4">
        Lade App
      </div>
    </v-container>
  </v-app>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class App extends Vue {
}
</script>
