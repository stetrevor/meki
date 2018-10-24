/* From http://www.davekoelle.com/files/alphanum.js.
 * Adopted to ES6 syntax.
 */
export function alphanumSort(a, b) {
  function chunkify(t) {
    let tz = new Array()
    let x = 0,
      y = -1,
      n = 0,
      i,
      j

    while ((i = (j = t.charAt(x++)).charCodeAt(0))) {
      let m = i == 46 || (i >= 48 && i <= 57)
      if (m !== n) {
        tz[++y] = ''
        n = m
      }
      tz[y] += j
    }
    return tz
  }

  const aa = chunkify(a)
  const bb = chunkify(b)

  for (let x = 0; aa[x] && bb[x]; x++) {
    if (aa[x] !== bb[x]) {
      const c = Number(aa[x]),
        d = Number(bb[x])
      if (c == aa[x] && d == bb[x]) {
        return c - d
      } else return aa[x] > bb[x] ? 1 : -1
    }
  }
  return aa.length - bb.length
}
