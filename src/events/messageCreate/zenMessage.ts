import { Message } from 'discord.js'

import Config from '@/config'
import { TUser, userModel } from '@/schemas/userSchema'
import { isMirrorTime, incZenCount } from '@/utils'
import logger from '@/utils/logger'

const isFirstNose = async (date: Date): Promise<boolean> => {
  const oneMinuteAgo = new Date(date.valueOf() - 60 * 1000)
  try {
    const res: Pick<TUser, '_id'> | null = await userModel
      .findOne({ lastMessageTime: { $gte: oneMinuteAgo } })
      .select('_id')
      .exec()
    return res === null
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

  const userDoc: Pick<TUser, 'lastMessageTime' | 'streak'> | null =
    await userModel
      .findOne({ _id: message.author.id })
      .select('lastMessageTime streak')
      .exec()

  const lastMessageTime: Date = userDoc?.lastMessageTime || new Date(0)
  const timeSinceLastMessage = currentDate.getTime() - lastMessageTime.getTime()

  if (timeSinceLastMessage < 60 * 1000) {
    logger.info(
      `2 zen msgs < 60 sec ${message.author.displayName}`,
      currentDate,
      lastMessageTime,
    )
    return
  }

  const firstNose = await isFirstNose(currentDate)
  await incZenCount(
    message.author.id,
    currentDate,
    timeSinceLastMessage < 60 * (60 + 1) * 1000,
    userDoc?.streak,
  )

  message.react(currentDate.getSeconds() >= 55 && firstNose ? '😈' : emoji)
}

export default zenMessage
