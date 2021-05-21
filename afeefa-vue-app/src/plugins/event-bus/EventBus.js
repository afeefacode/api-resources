import Vue from 'vue'

class EventBus extends Vue {
  dispatch (event) {
    super.$emit(event.type, event)
    return event.promise || true
  }

  on (event, callback) {
    return super.$on(event, callback)
  }

  off (event, callback) {
    return super.$off(event, callback)
  }
}

export const eventBus = new EventBus()
