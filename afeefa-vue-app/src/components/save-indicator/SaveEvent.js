import { BaseEvent } from '../../plugins/event-bus/BaseEvent'

export class SaveEvent extends BaseEvent {
  static START_SAVING = 'SaveEvent:start'
  static STOP_SAVING = 'SaveEvent:stop'
}
