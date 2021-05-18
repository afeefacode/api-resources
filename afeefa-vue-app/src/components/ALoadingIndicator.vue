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

  created () {
    this.internalLoading = this.isLoading
  }

  @Watch('isLoading')
  isLoadingChanged () {
    if (this.isLoading) { // start immediately, but stop delayed
      this.internalLoading = this.isLoading
    }

    setTimeout(() => {
      this.internalLoading = this.isLoading
    }, 250)
  }
}
</script>
