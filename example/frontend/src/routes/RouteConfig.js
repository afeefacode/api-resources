export class RouteConfig {
  Model = null

  list = {
    Card: null,
    action: null,
    fields: {}
  }

  model = {
    action: null,
    fields: {}
  }

  detail = {
    Detail: null
  }

  create = {
    Form: null
  }

  edit = {
    Form: null
  }

  constructor (api) {
    this.api = api
  }
}
