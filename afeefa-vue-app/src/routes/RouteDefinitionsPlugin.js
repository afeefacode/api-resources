import DefaultRouteComponent from './DefaultRouteComponent'
import { SetDefinition } from './definition/SetDefinition'
import { SingleDefinition } from './definition/SingleDefinition'

export class RouteDefinitionsPlugin {
  routeNameDefinitionMap = {}

  static install (Vue) {
    Object.defineProperty(Vue.prototype, '$routeDefinition', {
      get () {
        return (this.$props && this.$props.rcp_routeDefinition) ||
        (this.$attrs && this.$attrs.rcp_routeDefinition)
      }
    })
  }

  _defaultComponents = {
    container: DefaultRouteComponent,
    list: DefaultRouteComponent,
    model: DefaultRouteComponent,
    detail: DefaultRouteComponent,
    edit: DefaultRouteComponent,
    new: DefaultRouteComponent
  }

  defaultComponents (components = {}) {
    this._defaultComponents = {
      ...this._defaultComponents,
      ...components
    }
    return this
  }

  _routes = []

  routes (callback = null) {
    if (callback) {
      const routeOrRoutes = callback({
        SET: this.set,
        SINGLE: this.single
      })
      this._routes = Array.isArray(routeOrRoutes) ? routeOrRoutes : [routeOrRoutes]
      return this
    }
  }

  getRoutes () {
    this._routes.forEach(r => r.setRouteName(''))
    this._routes.forEach(r => r.register(this.register))
    this._routes.forEach(r => r.setParent(null, this.routeNameDefinitionMap))
    return this._routes.map(r => r.toVue())
  }

  single = (options) => {
    return new SingleDefinition(options)
  }

  set = (options) => {
    options.components = {
      ...this._defaultComponents,
      ...options.components
    }

    const set = new SetDefinition(options)
    return set.getDefinitions()
  }

  register = (routeId, definition) => {
    if (routeId) {
      this.routeNameDefinitionMap[routeId] = definition
    }
  }
}
