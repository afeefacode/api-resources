<template>
  <v-snackbar
    v-model="snackbar"
    :multi-line="true"
    top
    :timeout="5000"
  >
    <v-icon
      size="2rem"
      :color="error ? 'red' : 'green'"
      class="icon"
    >
      {{ error ? '$alarmIcon' : '$thumbsUpIcon' }}
    </v-icon>

    <div v-if="error">
      <h3>Ein Fehler ist aufgetreten.</h3>
      <span v-html="error" />
    </div>

    <div v-if="success">
      <h3>Alles super!</h3>
      <span v-html="success" />
    </div>

    <v-btn
      icon
      class="closeButton"
      @click="hideSnackbar"
    >
      <v-icon>$closeIcon</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { AlertEvent } from './alert/AlertEvent'

@Component
export default class AAlert extends Vue {
  snackbar = false
  error = null
  success = null

  created () {
    this.$events.on(AlertEvent.ERROR, this.onError)
    this.$events.on(AlertEvent.MESSAGE, this.onMessage)
    window.addEventListener('mouseup', this.onMouseDown)
  }

  onError (alertEvent) {
    this.error = alertEvent.payload.message
    this.snackbar = true
  }

  onMessage (alertEvent) {
    this.success = alertEvent.payload.message
    this.snackbar = true
  }

  onMouseDown (event) {
    if (this.$el.contains(event.target)) {
      return
    }

    this.hideSnackbar()
  }

  hideSnackbar () {
    this.error = null
    this.success = null
    this.snackbar = false
  }
}
</script>

<style lang="scss" scoped>
.v-snack {
  .icon {
    font-size: 2rem;
  }
  ::v-deep {
    .v-snack__wrapper {
      width: 500px;
      margin-top: 1rem;
    }
    .v-snack__content {
      display: flex;
      align-items: center;
      padding: 1.2rem;
      font-size: 1rem;

      > *:not(:last-child) {
        margin-right: 1.5rem;
      }

      > div {
        flex-grow: 1;
      }

      h3 {
        margin-bottom: .5rem;
      }
    }
  }
}

</style>
