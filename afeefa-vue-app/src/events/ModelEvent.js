import { BaseEvent } from './BaseEvent'

export class ModelEvent extends BaseEvent {
  static ADD = 'ModelEvent:add'
  static DELETE = 'ModelEvent:delete'
}
