<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
    @click:outside="cancel"
    @keydown.esc="cancel"
  >
    <v-card class="pb-1">
      <v-card-title>
        <span>{{ title }}</span>
      </v-card-title>

      <v-card-text v-if="message">
        <span v-html="message" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          class="mr-4"
          @click="ok"
        >
          {{ yesButton }}
        </v-btn>

        <v-btn @click="cancel">
          {{ cancelButton }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { DialogEvent } from './dialog/DialogEvent'

@Component
export default class ADialog extends Vue {
  title = null
  message = null
  yesButton = null
  cancelButton = null

  dialog = false
  dialogEvent = null

  created () {
    this.$events.on(DialogEvent.SHOW, this.show)
  }

  show (dialogEvent) {
    this.title = dialogEvent.payload.title
    this.message = dialogEvent.payload.message
    this.yesButton = dialogEvent.payload.yesButton || 'Ja'
    this.cancelButton = dialogEvent.payload.cancelButton || 'Abbrechen'

    this.dialogEvent = dialogEvent
    this.dialog = true
  }

  ok () {
    this.dialogEvent.resolve(DialogEvent.RESULT_YES)
    this.dialog = false
  }

  cancel () {
    this.dialogEvent.resolve(DialogEvent.RESULT_CANCEL)
    this.dialog = false
  }
}
</script>
