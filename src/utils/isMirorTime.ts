import { getHours, getMinutes } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export const isMirrorTime = (
  now = new Date(),
  tz = 'Europe/Paris',
): boolean => {
  const parisTime = utcToZonedTime(now, tz)

  return getHours(parisTime) === getMinutes(parisTime)
}
