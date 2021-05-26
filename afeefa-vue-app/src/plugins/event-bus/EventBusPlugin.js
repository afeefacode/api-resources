import { eventBus } from './EventBus'

class EventBusPlugin {
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$events', {
      get () {
        return eventBus
      }
    })

    Object.defineProperty(Vue.prototype, '$emitOnParent', {
      get () {
        return (event, value) => {
          let parent = this
          while (parent) {
            if (parent.$listeners[event]) {
              parent.$emit(event, value)
              break
            }
            parent = parent.$parent
          }
        }
      }
    })
  }
}

export const eventBusPlugin = new EventBusPlugin()
