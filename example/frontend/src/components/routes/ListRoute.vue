<template>
  <div>
    <div
      v-for="(filter, name) in filters"
      :key="name"
    >
      <p v-if="false">
        {{ name }} {{ filter.value }} {{ filter.serialize() }}
      </p>

      <template v-if="filter.type === 'Afeefa.KeywordFilter'">
        <v-text-field
          v-model="filter.value"
          label="Suche"
          title="Suche"
          clearable
        />
      </template>

      <template v-if="filter.type === 'Afeefa.PageFilter'">
        <v-pagination
          v-if="models.length"
          v-model="filter.value"
          :length="numPages"
          :total-visible="8"
        />
      </template>

      <template v-if="filter.type === 'Afeefa.OrderFilter'">
        <v-select
          v-model="filter.value"
          :label="filter.name"
          :items="orderItems"
          item-text="itemText"
          item-value="itemValue"
          :clearable="!filter.hasDefaultValue()"
          :value-comparator="compareOrderValues"
        />
      </template>

      <template v-if="filter.type === 'Afeefa.PageSizeFilter'">
        <a-select
          v-model="filter.value"
          :label="filter.name"
          :items="filter.options"
          :defaultValue="filter.defaultValue"
          :clearable="!filter.hasDefaultValue()"
        />
      </template>

      <template v-if="filter.type === 'Afeefa.BooleanFilter' && filter.options.includes(false)">
        <v-select
          v-model="filter.value"
          :label="filter.name"
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

      <template v-if="filter.type === 'Afeefa.IdFilter'">
        <p v-if="false">
          Name: {{ name }} {{ filter.request && filter.request._action.getName() }}
        </p>

        <a-select
          v-model="filter.value"
          :label="filter.name"
          :items="getIdItems(filter)"
          item-text="itemTitle"
          item-value="itemValue"
          :clearable="filter.value !== null"
          :value-comparator="compareOrderValues"
        />
      </template>

      <template v-if="false" />
    </div>

    <template v-if="models.length">
      <component
        :is="model.$components.listCard"
        v-for="model in models"
        :key="model.id"
        :model="model"
        :filters="filters"
        v-bind="{model}"
      />
    </template>

    <div v-else>
      Nichts gefunden. <a
        href=""
        @click.prevent="resetFilters()"
      >Filter zurücksetzen</a>
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
  items = []
  requestFilters = null

  created () {
    this.init()
  }

  destroyed () {
    this.requestFilters.off('change', this.filterValueChanged)
  }

  @Watch('$route.name')
  routeNameChanged () {
    this.init()
  }

  init () {
    if (this.requestFilters) {
      this.requestFilters.off('change', this.filterValueChanged)
    }

    const querySource = new RouteQuerySource(this.$router)
    this.requestFilters = this.action.createRequestFilters(querySource)
    this.requestFilters.on('change', this.filterValueChanged)
    this.load()
  }

  get action () {
    return this.$routeConfig.route.listAction
  }

  get filters () {
    return (this.requestFilters && this.requestFilters.getFilters()) || null
  }

  async getIdItems (filter) {
    const result = await filter.request.send()
    const items = result.data
    return items.map(i => {
      const count = filter.name === 'tag_id' ? i.count_users : i.count_articles
      return {
        itemTitle: `${i.name} (${count})`,
        itemValue: i.id
      }
    })
  }

  resetFilters () {
    this.requestFilters.reset()
  }

  get orderItems () {
    const items = []
    for (const [fieldName, directions] of Object.entries(this.filters.order.options)) {
      for (const direction of directions) {
        items.push({
          // itemText, itemValue instead of title, value:
          // https://github.com/vuetifyjs/vuetify/issues
          itemText: fieldName + ' ' + direction,
          itemValue: {
            [fieldName]: direction
          }
        })
      }
    }
    return items
  }

  compareOrderValues (a, b) {
    return JSON.stringify(a) === JSON.stringify(b)
  }

  filterValueChanged (event) {
    this.load()
  }

  get numPages () {
    const pageSize = this.filters.page_size.value
    return Math.ceil(this.meta.count_search / pageSize)
  }

  async load () {
    const result = await this.action
      .request()
      .fields(this.$routeConfig.route.listFields)
      .filters(this.requestFilters.serialize())
      .send()

    this.models = result.data
    this.meta = result.meta

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

.tags {
  display: flex;
  gap: 1rem;
}
</style>
