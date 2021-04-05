import { RouteDefinition } from './RouteDefinition'

export class RouteSetDefinition {
  constructor ({path, name, idKey, components}) {
    this.path = path
    this.name = name
    this.idKey = idKey
    this.components = components
  }

  getDefinitions () {
    return this.route('container', this.path, false, false, [
      this.route('list', '', true, false),
      this.route('new', 'new', true, false),
      this.route('model', ':' + this.idKey, false, true, [
        this.route('detail', '', true, true),
        this.route('edit', 'edit', true, true)
      ])
    ])
  }

  route (action, path, hasRouteName, hasId, children = []) {
    const routeId = `${this.name}.${action}`
    const component = this.components[action]

    const options = {
      routeId,
      path,
      name: hasRouteName ? routeId : null,
      component,
      children,
      props: route => {
        const props = {}
        if (hasId) {
          props[this.idKey] = route.params[this.idKey]
        }
        return props
      }
    }

    const definition = new RouteDefinition(options)

    if (['new', 'detail'].includes(action)) {
      definition.setParent = function (parent, routeNameDefinitionMap) {
        // const listId = this.routeId.replace(/${action}$/)
        console.log('TODO setParent', this.routeId)
        // this.parent = 'HOHO'
      }
    }
    return definition
  }
}
