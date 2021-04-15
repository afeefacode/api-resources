<template>
  <div>
    <ul v-if="filters">
      <li
        v-for="(filter, name) in filters"
        :key="name"
      >
        {{ name }} {{ filter.value }} {{ filter.serialize() }}

        <template v-if="filter.type === 'Afeefa.KeywordFilter'">
          <v-text-field
            v-model="filter.value"
            label="Suche"
            title="Suche"
            clearable
            @input="filterInputChanged(filter.name)"
          />
        </template>

        <template v-if="filter.type === 'Afeefa.PageFilter'">
          <v-pagination
            v-if="models.length"
            v-model="filter.value"
            :length="numPages"
            :total-visible="8"
            @input="filterInputChanged(filter.name)"
          />
        </template>

        <template v-if="filter.type === 'Afeefa.OrderFilter'">
          <v-select
            v-model="filter.value"
            :items="orderItems"
            item-text="title"
            item-value="value"
            :clearable="filter.value !== null"
            :value-comparator="compareOrderValues"
          />
        </template>

        <template v-if="filter.type === 'Afeefa.PageSizeFilter'">
          <v-select
            v-model="filter.value"
            :items="filter.options"
          />
        </template>

        <template v-if="filter.type === 'Afeefa.BooleanFilter' && filter.options.includes(false)">
          <v-select
            v-model="filter.value"
            :items="filter.options"
            :clearable="filter.value !== null"
          />
        </template>

        <template v-else-if="filter.type === 'Afeefa.BooleanFilter'">
          <p>
            <input
              :id="'checkbox-' + name"
              v-model="filter.value"
              type="checkbox"
            > <label :for="'checkbox-' + name">{{ name }}</label>
          </p>
        </template>

        <template v-if="false">
          <template v-if="filter.type === 'Afeefa.IdFilter'">
            <p>Name: {{ name }}</p>
          </template>
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
          # {{ model.id }} | am {{ model.date }} | Kommentare: {{ model.count_comments }}
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

    console.log(this.filters.page)

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

  get orderItems () {
    const items = []
    for (const [fieldName, directions] of Object.entries(this.filters.order.options)) {
      for (const direction of directions) {
        items.push({
          title: fieldName + ' ' + direction,
          value: [fieldName, direction]
        })
      }
    }
    return items
  }

  compareOrderValues (a, b) {
    if (a && b && a.every((val, index) => val === b[index])) {
      return true
    }
    return false
  }

  filterValueChanged (event) {
    // console.log('filter value changed', event.filter.serialize())
    this.load()
  }

  filterInputChanged (name) {
    // console.log('filter input changed', name)
  }

  get numPages () {
    const pageSize = this.filters.page_size.value
    return Math.ceil(this.meta.count_search / pageSize)
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
        // count_comments: true
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
