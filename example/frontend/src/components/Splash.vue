<template>
  <app-splash
    title="Lade Beratungsdatenbank ..."
    color="#82b81c"
  >
    <img src="/frontend/logo.svg">
  </app-splash>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import AppSplash from '@a-admin/components/Splash'

@Component({
  components: {
    AppSplash
  }
})
export default class Splash extends Vue {
}
</script>


<style lang="scss" scoped>
img {
  width: 80vw;
  max-width: 600px;
}
</style>
