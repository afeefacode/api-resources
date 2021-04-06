import DefaultRouteComponent from './DefaultRouteComponent'
import { RouteDefinition } from './RouteDefinition'
import { RouteSetDefinition } from './RouteSetDefinition'

export class RouteConfigPlugin {
  pathDefinitionMap = {}

  _defaultComponents = {
    container: DefaultRouteComponent,
    list: DefaultRouteComponent,
    model: DefaultRouteComponent,
    detail: DefaultRouteComponent,
    edit: DefaultRouteComponent,
    new: DefaultRouteComponent
  }

  _routes = []

  static install (Vue) {
    Object.defineProperty(Vue.prototype, '$routeDefinition', {
      get () {
        return (this.$props && this.$props.rcp_routeDefinition) ||
          (this.$attrs && this.$attrs.rcp_routeDefinition)
      }
    })
    Object.defineProperty(Vue.prototype, '$routeConfig', {
      get () {
        return (this.$routeDefinition && this.$routeDefinition.config) || {}
      }
    })
  }

  defaultComponents (components = {}) {
    this._defaultComponents = {
      ...this._defaultComponents,
      ...components
    }
    return this
  }

  routes (callback = null) {
    if (callback) {
      const routeOrRoutes = callback({
        ROUTESET: this.routeSet,
        ROUTE: this.route
      })
      this._routes = Array.isArray(routeOrRoutes) ? routeOrRoutes : [routeOrRoutes]
      this._routes.forEach(r => r.init(null, '', this.pathDefinitionMap))
      return this
    }
  }

  getRoutes () {
    return this._routes.map(r => r.toVue())
  }

  dumpRoutes () {
    for (const path in this.pathDefinitionMap) {
      const r = this.pathDefinitionMap[path]
      const whites = ' '.repeat(60 - path.length)
      const whites2 = ' '.repeat(40 - r.fullName.length)
      console.log('path:', path, whites, 'name:', r.fullName, whites2, 'parent:', r.parentPathDefinition && r.parentPathDefinition.fullName)
    }
  }

  route = (options) => {
    return new RouteDefinition(options)
  }

  routeSet = (options) => {
    options.components = {
      ...this._defaultComponents,
      ...options.components
    }
    return new RouteSetDefinition(options).getDefinitions()
  }
}
