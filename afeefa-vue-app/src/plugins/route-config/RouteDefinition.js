export class RouteDefinition {
  parent = null
  children = []

  constructor ({routeId = '', path, name = '', component, props = {}, meta = {}, children = []}) {
    console.log('set', routeId)
    this.routeId = routeId || name || ''
    this.path = path
    this.routeName = name || ''
    this.component = component
    this.props = props
    this.meta = meta

    this.addChildren(children)
  }

  setRouteName (parentName) {
    this.routeId = [parentName, this.routeId].filter(rn => rn).join('.')
    if (this.routeName) {
      parentName = [parentName, this.routeName].filter(rn => rn).join('.')
      this.routeName = parentName
    }
    this.children.forEach(c => c.setRouteName(parentName))
  }

  setParent (parent, routeNameDefinitionMap) {
    this.parent = parent
    if (this.routeName) {
      parent = this
    }
    this.children.forEach(c => c.setParent(parent, routeNameDefinitionMap))
  }

  addChildren (children) {
    this.children = this.children.concat(children)
  }

  toVue () {
    // console.log(this.routeId, '---------', this.routeName, '---------------', this.parent && this.parent.routeId)

    const props = route => {
      let props = this.props
      if (typeof props === 'function') {
        props = props(route)
      }
      props.rcp_routeDefinition = this
      return props
    }

    return {
      path: this.path,
      name: this.routeName,
      component: this.component,
      props: props,
      meta: this.meta,
      children: this.children.map(c => c.toVue())
    }
  }

  register (register) {
    register(this.routeId, this)
    this.children.map(c => c.register(register))
  }
}
