import { SingleDefinition } from './SingleDefinition'

export class SetDefinition {
  constructor ({path, name, idKey, components}) {
    this.path = path
    this.name = name
    this.idKey = idKey
    this.components = components
  }

  getDefinitions () {
    return this.single('container', this.path, false, false, [
      this.single('list', '', true, false),
      this.single('new', 'new', true, false),
      this.single('model', ':' + this.idKey, false, true, [
        this.single('detail', '', true, true),
        this.single('edit', 'edit', true, true)
      ])
    ])
  }

  single (action, path, hasRouteName, hasId, children = []) {
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

    const definition = new SingleDefinition(options)

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
