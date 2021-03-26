import DefaultRouteComponent from './DefaultRouteComponent'

export class RouteSet {
  name = null
  path = null
  idKey = null
  components = {}
  props = {}

  modelTitle = null

  static create ({name, path, idKey, components, props}) {
    return new RouteSet(name, path, idKey, components, props)
  }

  constructor (name, path, idKey, components, props) {
    this.name = name
    this.path = path
    this.idKey = idKey
    this.components = components
    this.props = props
  }

  setModelTitle (title) {
    this.modelTitle = title
  }

  toBreadcrumb (routeName, routeParams) {
    const routes = []

    if (routeName.match(/\.edit/)) {
      routes.push(
        {
          title: this.getTitle('list'),
          to: {name: `${this.name}.list`}
        },
        {
          title: this.modelTitle || this.getTitle('detail'),
          to: {name: `${this.name}.detail`, params: routeParams}
        },
        {
          title: this.getTitle('edit'),
          to: {name: `${this.name}.edit`, params: routeParams}
        }
      )
    }

    if (routeName.match(/\.detail/)) {
      routes.push(
        {
          title: this.getTitle('list'),
          to: {name: `${this.name}.list`}
        },
        {
          title: this.modelTitle || this.getTitle('detail'),
          to: {name: `${this.name}.detail`, params: routeParams}
        }
      )
    }

    if (routeName.match(/\.new/)) {
      routes.push(
        {
          title: this.getTitle('list'),
          to: {name: `${this.name}.list`}
        },
        {
          title: this.getTitle('new'),
          to: {name: `${this.name}.new`}
        }
      )
    }

    if (routeName.match(/\.list/)) {
      routes.push(
        {
          title: this.getTitle('list'),
          to: {name: `${this.name}.list`}
        }
      )
    }

    return routes
  }

  getTitle (action) {
    const component = this.components[action]
    return typeof component.title === 'string' ? component.title : component.title(this)
  }

  toVueRoutes () {
    return {
      ...this.getRoute('container', this.path, false, false),

      children: [
        this.getRoute('list', '', true, false),
        this.getRoute('new', this.components.new.path || 'new', true, false),
        {
          ...this.getRoute('model', ':' + this.idKey, false, true),

          children: [
            this.getRoute('detail', '', true, true),
            this.getRoute('edit', this.components.edit.path || 'edit', true, true)
          ]
        }
      ]
    }
  }

  getRoute (action, path, hasName, hasId) {
    const routeName = `${this.name}.${action}`
    const component = (this.components[action] && this.components[action].component) || DefaultRouteComponent

    const route = {
      path,
      component,
      props: route => {
        const props = {
          routeName,
          routeSet: this
        }

        if (hasId) {
          props.id = route.params[this.idKey]
        }

        return props
      }
    }

    if (hasName) {
      route.name = routeName
    }

    return route
  }
}
