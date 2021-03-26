import { BaseEvent } from './BaseEvent'

export class AlertEvent extends BaseEvent {
  static ERROR = 'AlertEvent:error'
  static MESSAGE = 'AlertEvent:message'
}
