import { MessageReaction, User } from 'discord.js'
import { TUser, userModel } from 'schemas/userSchema'

import Config from '@/config'
import { isMirrorTime, incZenCount } from '@/utils'
import logger from '@/utils/logger'

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
    const userDoc: Pick<TUser, 'lastMessageTime' | 'streak'> | null =
      await userModel
        .findOne({ _id: user.id })
        .select('lastMessageTime streak')
        .exec()
    const lastMessageTime: Date = userDoc?.lastMessageTime || new Date(0)

    const timeSinceLastMessage =
      currentDate.getTime() - lastMessageTime.getTime()

    if (timeSinceLastMessage < 60 * 1000) {
      logger.info(
        `2 zen msgs < 60 sec ${user.displayName}`,
        currentDate,
        lastMessageTime,
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
