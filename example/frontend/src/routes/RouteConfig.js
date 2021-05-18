import { breadcrumbEvent } from '@/components/Breadcrumbs'

export class RouteConfig {
  constructor (api) {
    this.api = api
  }

  setRouteModel (model) {
    this.model = model
    breadcrumbEvent.$emit('update')
  }
}
