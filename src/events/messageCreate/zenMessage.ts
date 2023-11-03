import { PrismaClient } from '@prisma/client'
import { Message } from 'discord.js'
import { isMirrorTime, incZenCount, logger } from 'utils'

import Config from '@/config'

const prisma = new PrismaClient()

const isFirstNose = async (date: Date): Promise<boolean> => {
  const oneMinuteAgo = new Date(date.valueOf() - 60 * 1000)
  try {
    const user = await prisma.user.findFirst({
      where: {
        lastZen: {
          gte: oneMinuteAgo,
        },
      },
      select: {
        id: true,
      },
    })
    return !user
  } catch (error) {
    logger.error(error)
    throw new Error('Database operation failed')
  }
}

const getEmoji = (message: Message, date: Date): string | null => {
  if (!isMirrorTime(date)) return null

  const isZenMessage = Config.ZEN.keywords.some((keyword) =>
    message.content.toLowerCase().includes(keyword),
  )

  if (isZenMessage) return '👃'

  return (
    Config.ZEN.emojis.find((emoji) => message.content.includes(emoji)) || null
  )
}

const zenMessage = async (message: Message): Promise<void> => {
  const currentDate = new Date()
  const emoji = getEmoji(message, currentDate)

  if (emoji === null) return

  const user = await prisma.user.findUnique({
    where: {
      id: message.author.id,
    },
    select: {
      lastZen: true,
      streak: true,
    },
  })

  const lastZen: Date = user?.lastZen || new Date(0)
  const timeSinceLastMessage = currentDate.getTime() - lastZen.getTime()

  if (timeSinceLastMessage < 60 * 1000) {
    logger.info(
      `2 zen msgs < 60 sec ${message.author.displayName}`,
      currentDate,
      lastZen,
    )
    return
  }

  const firstNose = await isFirstNose(currentDate)
  await incZenCount(
    message.author.id,
    currentDate,
    timeSinceLastMessage < 60 * 60 * 1000,
    user?.streak,
  )

  message.react(currentDate.getSeconds() >= 55 && firstNose ? '😈' : emoji)
}

export default zenMessage
