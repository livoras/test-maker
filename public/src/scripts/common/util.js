export function log(info) {
  console.log(info)
}

export function clone(obj) {
  if (!obj) return null
  return JSON.parse(JSON.stringify(obj))
}
