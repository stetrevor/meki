export function alphanumSort(v1, v2) {
  const [t1, t2] = [v1.title, v2.title]
  if (t1 == t2) return 0

  if (typeof t1 === typeof t2) {
    return t1 < t2 ? -1 : 1
  }

  return typeof a < typeof b ? -1 : 1
}
