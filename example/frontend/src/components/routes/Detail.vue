<template>
  <div>
    Detail {{ $routeDefinition.routeId }}
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Detail extends Vue {
  created () {
    console.log('Detail', this.$props, this.$attrs, this.$route)
  }
}
</script>
