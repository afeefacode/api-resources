<template>
  <div>
    <a-loading-indicator :isLoading="isLoading" />

    <router-link
      class="button"
      :to="newLink"
    >
      <v-btn>Neu</v-btn>
    </router-link>

    <component
      :is="Filters"
      class="filters"
      :count="meta.count_search"
      :filters="filters"
      @filtersChanged="filtersChanged"
    />

    <template v-if="!isLoading && models.length">
      <component
        :is="Card"
        v-for="model in models"
        :key="model.id"
        :model="model"
        :filters="filters"
      />
    </template>

    <div v-else-if="!isLoading">
      Nichts gefunden. <a
        href=""
        @click.prevent="resetFilters()"
      >Filter zurücksetzen</a>
    </div>

    <div v-else>
      Loading
    </div>
  </div>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteQuerySource } from '@avue/services/list-filters/RouteQuerySource'

@Component
export default class ListRoute extends Vue {
  models = []
  meta = {}
  requestFilters = null
  isLoading = false

  created () {
    this.init()
  }

  destroyed () {
    this.requestFilters.off('change', this.filtersChanged)
  }

  init () {
    this.models = []
    this.meta = {}

    if (this.requestFilters) {
      this.requestFilters.off('change', this.filtersChanged)
    }

    const querySource = new RouteQuerySource(this.$router)
    this.requestFilters = this.action.createRequestFilters(querySource)
    this.requestFilters.on('change', this.filtersChanged)
    this.filtersChanged()
  }

  @Watch('$route.name')
  routeNameChanged () {
    this.init()
  }

  filtersChanged () {
    this.load()
  }

  get config () {
    return this.$routeDefinition.config.route
  }

  get action () {
    return this.config.list.action
  }

  get filters () {
    return this.requestFilters.getFilters()
  }

  get newLink () {
    return this.config.Model.getLink('new')
  }

  get Card () {
    return this.config.list.Card
  }

  get Filters () {
    return this.config.list.Filters
  }

  resetFilters () {
    this.requestFilters.reset()
  }

  async load () {
    this.isLoading = true

    const result = await this.action
      .request()
      .fields(this.config.list.fields)
      .filters(this.requestFilters.serialize())
      .send()

    this.models = result.data
    this.meta = result.meta

    this.requestFilters.initFromUsed(this.meta.used_filters)
    this.isLoading = false
  }
}
</script>


<style lang="scss" scoped>
.filters {
  margin-bottom: 3rem;
}
</style>
