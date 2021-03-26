import { RouteSet } from './RouteSet'

export class SimpleRoute extends RouteSet {
  component = null

  static create ({name, path, component, title}) {
    return new SimpleRoute(name, path, component, title)
  }

  constructor (name, path, component, title) {
    super()

    this.name = name
    this.path = path
    this.component = component
    this.title = title
  }

  setModelTitle (title) {
    this.title = title
  }

  toVueRoute () {
    const route = {
      path: this.path,
      name: this.name,
      component: this.component,
      props: route => {
        const props = {
          routeName: this.name,
          routeSet: this
        }
        return props
      }
    }
    return route
  }

  toBreadcrumb (routeName, routeParams) {
    if (!this.title) {
      return []
    }

    return [
      {
        title: this.title || ''
      }
    ]
  }
}
