<template>
  <router-view />
</template>

<script>
import { Component, Mixins } from 'vue-property-decorator'
import { RouteComponentMixin } from './RouteComponentMixin'

@Component
export default class DefaultRouteComponent extends Mixins(RouteComponentMixin) {
}
</script>
