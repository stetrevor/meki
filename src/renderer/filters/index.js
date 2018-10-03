function toTime(runtime) {
  const pad = num => `00${num}`.slice(-2)

  let num = Math.floor(runtime * 1000) // Total milliseconds
  const milliseconds = num % 1000
  num = (num - milliseconds) / 1000
  const seconds = num % 60
  num = (num - seconds) / 60
  const minutes = num % 60
  const hours = (num - minutes) / 60
  const hoursStr = hours > 0 ? `${hours} : ` : ''
  return `${hoursStr}${pad(minutes)} : ${pad(seconds)}`
}

export { toTime }
