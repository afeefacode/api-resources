<script>
import { Component, Vue } from 'vue-property-decorator'
import { AlertEvent, DialogEvent, SaveEvent } from '@avue/events'
import { sleep } from '@avue/utils/timeout'

@Component
export default class BaseEditRoute extends Vue {
  valid = false
  changed = false
  modelToEdit = null

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
    if (this.changed) {
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

  async save () {
    this.$events.dispatch(new SaveEvent(SaveEvent.START_SAVING))

    await this.action.request()
      .params(this.saveParams)
      .data(this.modelToEdit.serialize(this.fields))
      .send()

    await sleep()

    this.$events.dispatch(new SaveEvent(SaveEvent.STOP_SAVING))

    this.$events.dispatch(new AlertEvent(AlertEvent.MESSAGE, {
      message: 'Die Daten wurden gespeichert.'
    }))

    this.$emitOnParent('update:model')
  }

  reset () {
    this.modelToEdit = this.createModelToEdit()
  }
}
</script>


<style lang="scss" scoped>
button {
  display: block;
  margin: 2rem 0;
}
</style>
