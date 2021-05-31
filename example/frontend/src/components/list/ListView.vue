<template>
  <div>
    <div class="filters">
      <slot name="filters" />
    </div>

    <template v-if="!isLoading && models.length">
      <div
        v-for="model in models"
        :key="model.id"
      >
        <slot
          name="model"
          :model="model"
        />
      </div>
    </template>

    <div v-else-if="!isLoading">
      Nichts gefunden. <a
        href=""
        @click.prevent="resetFilters()"
      >Filter zurücksetzen</a>
    </div>
  </div>
</template>


<script>
import { Component, Mixins } from 'vue-property-decorator'
import ListViewMixin from '@avue/components/list/ListViewMixin'

@Component
export default class ListView extends Mixins(ListViewMixin) {
}
</script>


<style lang="scss" scoped>
.filters {
  margin-bottom: 3rem;
}
</style>
