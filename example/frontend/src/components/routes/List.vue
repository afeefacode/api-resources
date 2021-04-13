<template>
  <div>
    <ul v-if="filters">
      <li
        v-for="(filter, name) in filters"
        :key="name"
      >
        {{ name }} {{ filter.serialize() }} {{ filter.defaultValue }}

        <template v-if="filter.type === 'Afeefa.PageFilter'">
          <v-pagination
            v-if="models.length"
            v-model="filter.value.page"
            :length="numPages"
            :total-visible="8"
            @input="filterInputChanged(filter.name)"
          />
        </template>

        <template v-if="filter.type === 'Afeefa.KeywordFilter'">
          <v-text-field
            v-model="filter.value"
            label="Suche"
            title="Suche"
            @input="filterInputChanged(filter.name)"
          />
        </template>

        <template v-if="filter.type === 'Afeefa.OrderFilter'">
          <p>Order: {{ filter.fields }}</p>
        </template>

        <template v-if="filter.type === 'Afeefa.BooleanFilter'">
          <p>
            <input
              id="checkbox"
              v-model="filter.value"
              type="checkbox"
            > <label for="checkbox">Hoho</label>
          </p>
        </template>

        <template v-if="filter.type === 'Afeefa.IdFilter'">
          <p>Name: {{ name }}</p>
        </template>
      </li>
    </ul>

    <h3>List</h3>
    <ul>
      <li>Config: {{ Object.keys($routeConfig) }}</li>
      <li>{{ $routeDefinition.fullId }}</li>
      <li>{{ $routeDefinition.fullName }}</li>
      <li>{{ $routeDefinition.fullPath }}</li>
    </ul>

    <h1>Models</h1>

    <ul>
      <li
        v-for="model in models"
        :key="model.id"
      >
        <router-link :to="{name: 'articles.detail', params: { articleId: model.id }}">
          Artikel
        </router-link>

        <div class="meta">
          # {{ model.id }} | Am {{ model.date }}
        </div>
        <div class="author">
          {{ model.author.name }}
        </div>
        <div class="title">
          {{ model.title }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import Widget from '../Widget.vue'
import { RouteQuerySource } from '@avue/services/list-filters/RouteQuerySource'

@Component({
  components: {
    Widget
  }
})
export default class List extends Vue {
  models = []
  meta = {}

  requestFilters = null

  created () {
    const querySource = new RouteQuerySource(this.$router)
    this.requestFilters = this.action.requestFilters(querySource)

    this.requestFilters.on('change', this.filterValueChanged)
    this.load()
  }

  destroyed () {
    this.requestFilters.off('change', this.filterValueChanged)
  }

  get action () {
    return this.$routeConfig.action
  }

  get filters () {
    return (this.requestFilters && this.requestFilters.getFilters()) || null
  }

  get querySource () {
    return this.requestFilters.getQuerySource()
  }

  filterValueChanged (event) {
    console.log('filter value changed', event.filter.serialize())
    this.load()
  }

  filterInputChanged (name) {
    // console.log('filter input changed', name)
  }

  get numPages () {
    return Math.ceil(this.meta.count_search / 15)
  }

  async load () {
    const result = await this.action
      .request()
      .fields({
        title: true,
        date: true,
        author: {
          name: true
        }
      })
      .filters(this.requestFilters.serialize())
      .send()

    this.models = result.data.data
    this.meta = result.data.meta

    this.requestFilters.initFromUsed(this.meta.used_filters)
  }
}
</script>


<style lang="scss" scoped>
.meta {
  color: gray;
  font-size: .7rem;
}

.author {
  font-size: .9rem;
}

.title {
  font-weight: bold;
}
</style>
