export function formatDate(time) {
  var d = time.getDate()
  if (d < 10) {
    d = '0' + d
  }
  var h = time.getHours()
  if (h < 10) {
    h = '0' + h
  }
  var m = time.getMinutes()
  if (m < 10) {
    m = '0' + m
  }
  var mouth = time.getMonth() + 1
  if (mouth < 10) {
    mouth = '0' + mouth
  }
  return time.getFullYear() + '-' + mouth + '-' + d + ' ' + h + ':' + m
}

export function parseDate(timeStr) {
  var time = new Date(Date.parse(timeStr))
  return formatDate(time)
}
