import { BaseEvent } from '../event-bus/BaseEvent'

export class RouteEvent extends BaseEvent {
  static CHANGE = 'RouteEvent:change'
}
