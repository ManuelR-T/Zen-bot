import { Prisma, PrismaClient } from '@prisma/client'
import { isSameHour, isSameMinute } from 'date-fns'

const prisma = new PrismaClient()

export const findUsersToMark = async (
  lastMirrorDate: Date,
): Promise<Pick<Required<Prisma.UserCreateInput>, 'id' | 'lastZen'>[]> => {
  const users = await prisma.user.findMany({
    where: {
      streak: {
        gt: 0,
      },
    },
    select: {
      id: true,
      lastZen: true,
    },
  })

  return users.filter((user) => {
    const userLastZenTime = new Date(user.lastZen)
    return !(
      isSameHour(userLastZenTime, lastMirrorDate) &&
      isSameMinute(userLastZenTime, lastMirrorDate)
    )
  })
}

export const updateUserStreak = async (
  userId: string,
  streak: number,
): Promise<void> => {
  prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      streak,
    },
  })
}

export const getLeaderboardUsers = async (
  userNb: number,
): Promise<Required<Prisma.UserCreateInput>[]> => {
  return prisma.user.findMany({
    where: {
      streak: {
        gt: 0,
      },
    },
    orderBy: {
      streak: 'desc',
    },
    take: userNb,
  })
}
