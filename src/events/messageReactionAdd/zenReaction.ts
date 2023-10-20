import { PrismaClient } from '@prisma/client'
import { MessageReaction, User } from 'discord.js'

import Config from '@/config'
import { isMirrorTime, incZenCount } from '@/utils'
import logger from '@/utils/logger'

const prisma = new PrismaClient()

const zenReaction = async (
  reaction: MessageReaction,
  user: User,
): Promise<void> => {
  const currentDate = new Date()
  if (user.id === null) return
  if (!isMirrorTime(currentDate)) return

  const emote = reaction.emoji.name

  if (emote === null || !Config.ZEN.emojis.some((keyword) => emote === keyword))
    return

  try {
    const userDoc = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        lastZen: true,
        streak: true,
      },
    })

    const lastZen: Date = userDoc?.lastZen || new Date(0)
    const timeSinceLastMessage = currentDate.getTime() - lastZen.getTime()

    if (timeSinceLastMessage < 60 * 1000) {
      logger.info(
        `2 zen msgs < 60 sec ${user.displayName}`,
        currentDate,
        lastZen,
      )
      return
    }

    await incZenCount(
      user.id,
      undefined,
      timeSinceLastMessage < 60 * (60 + 1) * 1000,
      userDoc?.streak,
    )
  } catch (error) {
    logger.error('Error handling Nez message:', error)
  }
}

export default zenReaction
