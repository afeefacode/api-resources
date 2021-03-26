export class ApiError {
  response = null
  name = 'ApiError'
  message = null

  constructor (response) {
    if (this.isErrorResponse(response)) {
      response = response.response
    }

    this.response = response
    this.message = this.getErrorDescription(response)
  }

  isErrorResponse (response) {
    return response.response !== undefined
  }

  getErrorDescription (response) {
    let description = ''

    let data = response.body || response.data || response.message || {}
    data = data.data || data

    if (data) {
      if (data.message) {
        description = data.message
      } else if (data.errors) {
        for (const error of data.errors) {
          description += (error.detail || error) + '\n'
        }
      } else if (data.error) {
        description = data.error
      } else if (data.exception) {
        description = data.exception
      } else if (typeof data === 'string') {
        description = data
      }
    } else {
      description = response.statusText || response + ''
    }

    return description
  }
}
