import Vue from 'vue'

class EventBus extends Vue {
  dispatch (event) {
    super.$emit(event.type, event)
    return event.promise || true
  }
}

export const eventBus = new EventBus()

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
