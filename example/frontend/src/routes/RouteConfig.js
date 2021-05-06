import { breadcrumbEvent } from '@/components/Breadcrumbs'
import { Model } from '@afeefa/api-resources-client'

export class RouteConfig {
  routeName = ''
  idKey = ''

  resourceName = ''
  listActionName = ''
  getActionName = ''

  Model = Model
  model = null

  breadcrumbNames = {}

  listFields = {}
  getFields = {}

  constructor (api) {
    this.api = api
  }

  getRoute (action, model) {
    const to = {
      name: `${this.routeName}.${action}`
    }
    if (model) {
      to.params = {
        [this.idKey]: model.id
      }
    }
    return to
  }

  setRouteModel (model) {
    this.model = model
    breadcrumbEvent.$emit('update')
  }

  getBreadcrumb (routeDefinition) {
    let title
    if (routeDefinition.name.match(/detail$/)) {
      if (this.model) {
        title = this.model.getTitle()
      } else {
        title = this.breadcrumbNames.model
      }
    } else if (routeDefinition.name.match(/edit$/)) {
      title = 'Bearbeiten'
    } else if (routeDefinition.name.match(/new$/)) {
      title = 'Neu'
    } else {
      title = this.breadcrumbNames.list
    }
    return {
      title,
      to: { name: routeDefinition.fullName }
    }
  }

  get listAction () {
    return this.api.getAction(this.resourceName, this.listActionName)
  }

  get getAction () {
    return this.api.getAction(this.resourceName, this.getActionName)
  }
}
