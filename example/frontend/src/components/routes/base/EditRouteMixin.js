import { AlertEvent, DialogEvent, SaveEvent } from '@avue/events'
import { sleep } from '@avue/utils/timeout'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class EditRouteMixin extends Vue {
  valid = false
  changed = false
  modelToEdit = null
  ignoreChanged = false

  created () {
    this.modelToEdit = this.createModelToEdit()
  }

  createModelToEdit () {
    return null
  }

  get config () {
    return this.$routeDefinition.config.routing.edit
  }

  get Component () {
    return this.config.Component
  }

  get fields () {
    return this.config.fields
  }

  get action () {
    return this.config.action
  }

  async beforeRouteLeave (_to, _from, next) {
    if (!this.ignoreChanged && this.changed) {
      const result = await this.$events.dispatch(new DialogEvent(DialogEvent.SHOW, {
        title: 'Änderungen verwerfen?',
        message: 'Im Formular sind nicht gespeicherte Änderungen. Sollen diese verworfen werden?',
        yesButton: 'Verwerfen'
      }))
      if (result === DialogEvent.RESULT_YES) {
        next()
      }
      return
    }
    next()
  }

  get saveParams () {
    return {}
  }

  get json () {
    return this.modelToEdit.serialize(this.fields)
  }

  async save () {
    this.$events.dispatch(new SaveEvent(SaveEvent.START_SAVING))

    const result = await this.action.request()
      .params(this.saveParams)
      .data(this.modelToEdit.serialize(this.fields))
      .send()

    await sleep()

    this.$events.dispatch(new SaveEvent(SaveEvent.STOP_SAVING))

    if (result) {
      this.$events.dispatch(new AlertEvent(AlertEvent.MESSAGE, {
        message: 'Die Daten wurden gespeichert.'
      }))

      this.$emitOnParent('update:model')

      const model = result.data
      this.saved(model)
    } else {
      this.$events.dispatch(new AlertEvent(AlertEvent.ERROR, {
        message: 'Die Daten wurden nicht gespeichert.'
      }))
    }
  }

  reset () {
    this.modelToEdit = this.createModelToEdit()
  }

  saved (model) {
  }
}
