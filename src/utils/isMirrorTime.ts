import {
  getHours,
  getMinutes,
  setHours,
  setMinutes,
  subMinutes,
} from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export const isMirrorTime = (
  now = new Date(),
  tz = 'Europe/Paris',
): boolean => {
  const parisTime = utcToZonedTime(now, tz)

  return getHours(parisTime) === getMinutes(parisTime)
}

export const getLastMirrorTime = (
  now = new Date(),
  tz = 'Europe/Paris',
): Date => {
  let parisTime = utcToZonedTime(now, tz)
  const hour = parisTime.getHours()
  const minute = parisTime.getMinutes()

  if (minute >= hour) {
    parisTime = setMinutes(parisTime, hour)
  } else {
    parisTime = subMinutes(setHours(parisTime, hour - 1), 1)
    parisTime = setMinutes(parisTime, hour - 1)
  }

  return parisTime
}
