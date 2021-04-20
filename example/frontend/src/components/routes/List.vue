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

    <h3 v-if="false">
      List
    </h3>

    <ul v-if="false">
      <li>Config: {{ Object.keys($routeConfig) }}</li>
      <li>{{ $routeDefinition.fullId }}</li>
      <li>{{ $routeDefinition.fullName }}</li>
      <li>{{ $routeDefinition.fullPath }}</li>
    </ul>

    <ol v-if="models.length">
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

        <div class="tags">
          <a
            v-for="tag in model.tags"
            :key="tag.id"
            href=""
            @click.prevent="filters.tag_id.value = tag.id"
          >
            <tag :tag="tag" />
          </a>
        </div>
      </li>
    </ol>

    <div v-else>
      Nichts gefunden. <a
        href=""
        @click.prevent="resetFilters()"
      >Filter zurücksetzen</a>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import Widget from '../Widget.vue'
import Tag from '../Tag.vue'
import { RouteQuerySource } from '@avue/services/list-filters/RouteQuerySource'

@Component({
  components: {
    Widget,
    Tag
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

  async getIdItems (filter) {
    const result = await filter.request.send()
    const items = result.data.data

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
        },
        tags: {
          name: true,
          count_users: true
        },
        count_comments: true
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

.tags {
  display: flex;
  gap: 1rem;
}
</style>
