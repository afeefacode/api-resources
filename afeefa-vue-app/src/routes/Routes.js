import { eventBus } from '../events/EventBus'
import { RouteEvent } from './RouteEvent'

class Routes {
  currentRouteSet = null
  currentRouteName = null
  currentRouteParams = null

  setComponent (routeSet, routeName, routeParams) {
    this.currentRouteSet = routeSet
    this.currentRouteName = routeName
    this.currentRouteParams = routeParams

    eventBus.$emit(new RouteEvent(RouteEvent.CHANGE))
  }

  setRouteTitle (routeSet, title) {
    routeSet.setModelTitle(title)

    eventBus.$emit(new RouteEvent(RouteEvent.CHANGE))
  }

  toBreadcrumb () {
    if (!this.currentRouteSet) {
      return []
    }

    return this.currentRouteSet.toBreadcrumb(this.currentRouteName, this.currentRouteParams)
  }
}

export const routes = new Routes()
