const isDSTinParis = (date: Date) => {
  // Daylight Saving Time starts on the last Sunday of March
  const dstStart = new Date(date.getFullYear(), 2, 31, 2 - 1)
  dstStart.setDate(31 - dstStart.getDay())

  // Daylight Saving Time ends on the last Sunday of October
  const dstEnd = new Date(date.getFullYear(), 9, 31, 3 - 1)
  dstEnd.setDate(31 - dstEnd.getDay())

  return date >= dstStart && date < dstEnd
}

export const isMirrorTime = (now = new Date()): boolean => {
  const gmt = now.getTimezoneOffset() / 60
  const offset = isDSTinParis(now) ? 2 : 1

  now = new Date(now.getTime() + (offset + gmt) * 3600000)

  return now.getHours() === now.getMinutes()
}
