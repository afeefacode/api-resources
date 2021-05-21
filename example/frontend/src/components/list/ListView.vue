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
import { Component } from 'vue-property-decorator'
import BaseListView from '@avue/components/list/ListView'

@Component
export default class ListView extends BaseListView {
}
</script>


<style lang="scss" scoped>
.filters {
  margin-bottom: 3rem;
}
</style>
