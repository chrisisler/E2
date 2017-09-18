/** @type {(Function, ..., Function) -> Function} */
export const pipe =
  (...fns) =>
    (...args) =>
      fns.slice(1).reduce((x, fn) => fn(x), fns[0](...args))

export const getUniqId = (() => {
  let id = 1
  return () => id++
})()
