<template>
  <v-progress-linear
    v-if="internalLoading"
    style="position:absolute;top:0;left:0;"
    indeterminate
    color="green darken-2"
  />
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  props: ['isLoading']
})
export default class KLoadingIndicator extends Vue {
  internalLoading = false
  timeout = null

  created () {
    this.internalLoading = this.isLoading
  }

  @Watch('isLoading')
  isLoadingChanged () {
    if (this.isLoading) { // start immediately, but stop delayed
      this.internalLoading = this.isLoading
      clearTimeout(this.timeout)
    }

    this.timeout = setTimeout(() => {
      this.internalLoading = false
    }, 250)
  }
}
</script>
