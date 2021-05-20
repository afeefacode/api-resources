import { BaseEvent } from '../../plugins/event-bus/BaseEvent'

export class DialogEvent extends BaseEvent {
  static isAsync = true

  static SHOW = 'DialogEvent:show'

  static RESULT_YES = 'yes'
  static RESULT_NO = 'no'
  static RESULT_CANCEL = 'cancel'
}
