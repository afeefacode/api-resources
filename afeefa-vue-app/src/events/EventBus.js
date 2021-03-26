import Vue from 'vue'

class EventBus extends Vue {
  $emit (event) {
    super.$emit(event.type, event)
    return event.promise || true
  }
}

export const eventBus = new EventBus()
