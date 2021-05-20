import { eventBus } from './EventBus'

class EventBusPlugin {
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$events', {
      get () {
        return eventBus
      }
    })
  }
}

export const eventBusPlugin = new EventBusPlugin()
