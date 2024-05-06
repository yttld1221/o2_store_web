export const debounce = (func, time, ctx, immediate) => {
  let timer
  const rtn = (...params) => {
    clearTimeout(timer)
    if (immediate) {
      let callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, time)
      if (callNow) func.apply(ctx, params)
    } else {
      timer = setTimeout(() => {
        func.apply(ctx, params)
      }, time)
    }
  }
  return rtn
}
