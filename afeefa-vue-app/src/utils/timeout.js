export async function timeout (callback, delay = 300) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      let doReject = false

      let result = null
      if (callback instanceof Promise) {
        try {
          result = await callback
        } catch (error) {
          result = error
          doReject = true
        }
      } else {
        result = callback()
        if (result instanceof Promise) {
          try {
            result = await result
          } catch (error) {
            result = error
            doReject = true
          }
        }
      }

      if (doReject) {
        reject(result)
      } else {
        resolve(result)
      }
    }, delay)
  })
}

export async function sleep (sleep = 1) {
  if (!sleep) {
    return
  }
  return timeout(() => {}, sleep * 1000)
}
