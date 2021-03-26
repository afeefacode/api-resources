import { Component, Vue, Watch } from 'vue-property-decorator'

import { routes } from './Routes'

@Component({
  props: ['routeName', 'routeSet']
})
export class RouteComponentMixin extends Vue {
  created () {
    routes.setComponent(this.routeSet, this.routeName, this.$route.params)
  }

  @Watch('routeName')
  rcm_routeNameChangedInternal () {
    routes.setComponent(this.routeSet, this.routeName, this.$route.params)
    this.rcm_routeNameChanged()
  }

  rcm_routeNameChanged () {
    // do something about
  }

  rcm_setRouteTitle (title) {
    routes.setRouteTitle(this.routeSet, title)
  }
}
