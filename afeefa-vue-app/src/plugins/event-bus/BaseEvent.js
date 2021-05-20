export class BaseEvent {
  static isAsync = false

  type = null
  payload = null

  resolve = null
  promise = null

  constructor (type, payload) {
    this.type = type
    this.payload = payload

    if (this.constructor.isAsync) {
      this.promise = new Promise(resolve => {
        this.resolve = resolve
      })
    }
  }
}
