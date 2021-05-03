import { RouteDefinition } from './RouteDefinition'

export class RouteSetDefinition {
  constructor ({
    path,
    name,
    idKey = 'id',
    components,
    config = {},
    children = []
  }) {
    this.path = path
    this.name = name
    this.idKey = idKey
    this.components = components
    this.config = config
    this.children = children
  }

  getDefinitions () {
    return this.route('container', this.path, false, null, false, [
      this.route('list', '', true, null, false),
      this.route('new', 'new', true, '../list', false),
      this.route('model', `:${this.idKey}`, false, null, true, [
        this.route('detail', '', true, '../../list', true),
        this.route('edit', 'edit', true, '../detail', true),
        ...this.children
      ])
    ])
  }

  route (action, path, hasRouteName, breadcrumbParent, hasId, children = []) {
    const options = {
      path,
      component: this.components[action],
      name: hasRouteName ? action : '',
      config: this.config,
      children
    }

    if (['container'].includes(action)) {
      options.id = `${this.name}.${action}`
      options.childrenNamePrefix = this.name
    } else {
      options.id = action
    }

    if (breadcrumbParent) {
      options.breadcrumbParent = breadcrumbParent
    }

    if (hasId) {
      options.idKey = this.idKey
    }

    return new RouteDefinition(options)
  }
}
