<template>
  <div v-if="model">
    DETAIL
    <router-link :to="model.getRoute('edit')">
      <v-btn>Bearbeiten</v-btn>
    </router-link>

    <h3>{{ model.title }}</h3>

    <tag-list :model="model" />

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
export default class DetailRoute extends Vue {
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


<style lang="scss" scoped>
.summary {
  font-style: italic;
}
</style>
