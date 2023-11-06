import { Prisma, PrismaClient } from '@prisma/client'
import { logger } from 'utils'

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

const incZenCount = async (
  id: string,
  currentDate: Date = new Date(),
  isStreak: boolean,
  inc: number = 1,
): Promise<void> => {
  try {
    await prisma.$transaction(async (prisma) => {
      if (isStreak) {
        const user = await prisma.user.findUnique({
          where: { id },
          select: {
            streak: true,
            bestStreak: true,
          },
        })

        if (user) {
          const newStreak = user.streak + inc
          const updates: Prisma.UserUpdateInput = {
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
              set: Math.max(user.bestStreak, newStreak),
            },
            lastZen: currentDate,
          }

          await prisma.user.update({
            where: { id },
            data: updates,
          })
        } else {
          await prisma.user.create({
            data: defaultUserCreate(id),
          })
        }
      } else {
        const updates: Prisma.UserUpdateInput = {
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
        }

        await prisma.user.upsert({
          where: { id },
          update: updates,
          create: defaultUserCreate(id),
        })
      }
    })
  } catch (error) {
    logger.error(error)
    throw new Error('Database operation failed')
  }
}

export { incZenCount }
