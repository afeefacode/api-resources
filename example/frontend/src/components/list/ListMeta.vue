<template>
  <div class="listMeta">
    <slot />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ListMeta extends Vue {
}
</script>

<style lang="scss" scoped>
.listMeta {
  color: gray;
  font-size: .7rem;
}
</style>
