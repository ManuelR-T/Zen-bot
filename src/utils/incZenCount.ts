import { Prisma, PrismaClient } from '@prisma/client'

import logger from '@/utils/logger'

const prisma = new PrismaClient()

const defaultUserCreate = (id: string): Prisma.UserCreateInput => ({
  id,
  count: 1,
  countWeek: 1,
  countDay: 1,
  streak: 1,
  bestStreak: 1,
  lastZen: new Date(),
})

const updateZenCount = async (
  id: string,
  updates: Prisma.UserUpdateInput,
): Promise<void> => {
  try {
    await prisma.user.upsert({
      where: { id },
      update: updates,
      create: defaultUserCreate(id),
    })
  } catch (error) {
    logger.error(error)
    throw new Error('Database operation failed')
  }
}

const buildStreakUpdateQuery = (
  inc: number,
  streak: number,
  currentDate: Date,
): Prisma.UserUpdateInput => ({
  count: {
    increment: inc,
  },
  countWeek: {
    increment: inc,
  },
  countDay: {
    increment: inc,
  },
  streak: {
    increment: inc,
  },
  bestStreak: {
    set: Math.max(streak + inc, streak),
  },
  lastZen: currentDate,
})

const buildNonStreakUpdateQuery = (
  inc: number,
  currentDate: Date,
): Prisma.UserUpdateInput => ({
  count: {
    increment: inc,
  },
  countWeek: {
    increment: inc,
  },
  countDay: {
    increment: inc,
  },
  streak: {
    set: inc,
  },
  lastZen: currentDate,
})

export const incZenCount = async (
  id: string,
  currentDate: Date = new Date(),
  isStreak: boolean,
  streak: number = 1,
  inc: number = 1,
): Promise<void> => {
  const queryUpdate = isStreak
    ? buildStreakUpdateQuery(inc, streak, currentDate)
    : buildNonStreakUpdateQuery(inc, currentDate)

  await updateZenCount(id, queryUpdate)
}
