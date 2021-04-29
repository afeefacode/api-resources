<template>
  <router-link
    v-if="link"
    :to="link"
  >
    <h3>
      <slot />
    </h3>
  </router-link>

  <h3 v-else>
    <slot />
  </h3>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['link']
})
export default class ListTitle extends Vue {
}
</script>
