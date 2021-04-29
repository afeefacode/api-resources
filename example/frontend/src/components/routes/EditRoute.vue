<template>
  <div v-if="model">
    EDIT
    <router-link :to="model.getRoute('detail')">
      <v-btn>Ansehen</v-btn>
    </router-link>

    <h3>{{ model.title }}</h3>

    <p class="summary">
      {{ model.summary }}
    </p>

    <p>
      {{ model.content }}
    </p>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class EditRoute extends Vue {
  model = null

  created () {
    this.load()
  }

  get id () {
    const idKey = this.$routeDefinition.idKey
    return this.$route.params[idKey]
  }

  get action () {
    return this.$routeConfig.route.getAction
  }

  async load () {
    const result = await this.action.request()
      .params({
        id: this.id
      })
      .fields(this.$routeConfig.route.getFields)
      .send()

    this.model = result.data
  }
}
</script>
