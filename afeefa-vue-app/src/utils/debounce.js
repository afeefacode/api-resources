export function debounce (callback, delay = 300) {
  let timeout = null
  return function () {
    if (timeout) {
      clearTimeout(timeout)
    }

    const args = arguments
    timeout = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}
