import axios from 'axios'

import { AlertEvent, ModelEvent, SaveEvent } from '../events'
import { eventBus } from '../events/EventBus'
import { Model } from '../types/Model'
import { typeLoader } from '../types/TypeLoader'
import ModelType from '../types/types/ModelType'
import { timeout } from '../utils/timeout'
import { ApiError } from './ApiError'

class ApiClient {
  endpoint = null
  requestId = 0

  async list (query, info) {
    try {
      const result = await this.lastMinMilliSeconds(300, () => {
        const cancelSource = axios.CancelToken.source()

        if (info) {
          info({
            cancel: cancelSource.cancel,
            requestId: ++this.requestId
          })
        }

        return axios.post(
          this.endpoint + '/list',
          { query },
          { cancelToken: cancelSource.token }
        )
      })

      result.data.data = result.data.data.map(d => this.createModel(d))
      return result.data
    } catch (e) {
      if (!(e instanceof axios.Cancel)) {
        console.error(e)
        eventBus.$emit(new AlertEvent(AlertEvent.ERROR, {
          message: new ApiError(e).message
        }))
      }
      return null
    }
  }

  async loadTypes () {
    try {
      const result = await axios.get(this.endpoint + '/types')
      return result.data
    } catch (e) {
      eventBus.$emit(new AlertEvent(AlertEvent.ERROR, {
        message: new ApiError(e).message
      }))
      return null
    }
  }

  async get (type, id, fields) {
    const query = {
      type,
      id,
      fields
    }

    try {
      const result = await this.lastMinMilliSeconds(300, () => {
        return axios.post(this.endpoint + '/get', {
          query
        })
      })

      const data = result.data.data
      const model = this.createModel(data)
      return model
    } catch (e) {
      console.error(e)
      eventBus.$emit(new AlertEvent(AlertEvent.ERROR, {
        message: new ApiError(e).message
      }))
      return null
    }
  }

  async save (type, id, updates, fields) {
    const query = {
      type,
      id,
      updates,
      fields
    }

    try {
      eventBus.$emit(new SaveEvent(SaveEvent.START_SAVING))

      const result = await this.lastMinMilliSeconds(800, () => {
        return axios.post(this.endpoint + '/save', {
          query
        })
      })

      eventBus.$emit(new SaveEvent(SaveEvent.STOP_SAVING))
      if (!id) {
        eventBus.$emit(new ModelEvent(ModelEvent.ADD))
      }

      const data = result.data.data
      const model = this.createModel(data)
      return model
    } catch (e) {
      console.error(e)
      eventBus.$emit(new AlertEvent(AlertEvent.ERROR, {
        message: new ApiError(e).message
      }))
      eventBus.$emit(new SaveEvent(SaveEvent.STOP_SAVING))
      return null
    }
  }

  async delete (query) {
    try {
      eventBus.$emit(new SaveEvent(SaveEvent.START_SAVING))

      await this.lastMinMilliSeconds(800, () => {
        return axios.post(this.endpoint + '/delete', {
          query
        })
      })

      eventBus.$emit(new SaveEvent(SaveEvent.STOP_SAVING))
      eventBus.$emit(new ModelEvent(ModelEvent.DELETE))

      return true
    } catch (e) {
      console.error(e)
      eventBus.$emit(new AlertEvent(AlertEvent.ERROR, {
        message: new ApiError(e).message
      }))
      eventBus.$emit(new SaveEvent(SaveEvent.STOP_SAVING))
      return null
    }
  }

  async getCount (query) {
    try {
      return axios.post(this.endpoint + '/count', {
        query
      })
    } catch (e) {
      console.error(e)
      return null
    }
  }

  createModel (data) {
    const modelType = typeLoader.getModelType(data.type) || new ModelType({
      type: data.type,
      attributes: [],
      relations: [],
      filters: [],
      Class: Model
    })
    return modelType.createModel(data)
  }

  async lastMinMilliSeconds (milliseconds, callback) {
    const t1 = new Date().getTime()

    const result = await callback()

    const duration = new Date().getTime() - t1
    const timeLeft = Math.max(0, milliseconds - duration)

    // console.log(milliseconds, duration, timeLeft)

    return timeout(() => {
      return result
    }, timeLeft)
  }
}

export const apiClient = new ApiClient()
