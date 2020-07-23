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
  return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + d + ' ' + h + ':' + m
}



export function parseDate(timeStr) {
  var time = new Date(Date.parse(timeStr))
  return formatDate(time)
}
