import { MessageReaction, User } from 'discord.js'
import zenCountSchema, { IZenCount } from 'schemas/zenCountSchema'

import { NOSE } from '@/config'
import { isMirrorTime, incZenCount } from '@/utils'

const zenReaction = async (
  reaction: MessageReaction,
  user: User,
): Promise<void> => {
  const currentDate = new Date()
  if (user.id === null) return
  if (!isMirrorTime(currentDate)) return

  const emote = reaction.emoji.name

  if (emote === null || !NOSE.some((keyword) => emote === keyword)) return

  try {
    const userDoc: Pick<IZenCount, 'lastMessageTime' | 'streak'> | null =
      await zenCountSchema
        .findOne({ _id: user.id })
        .select('lastMessageTime streak')
        .exec()
    const lastMessageTime: Date = userDoc?.lastMessageTime || new Date(0)

    const timeSinceLastMessage =
      currentDate.getTime() - lastMessageTime.getTime()

    if (timeSinceLastMessage < 60 * 1000) {
      console.log('2 zen msgs < 60 sec', currentDate, lastMessageTime)
      return
    }

    await incZenCount(
      user.id,
      undefined,
      timeSinceLastMessage < 60 * (60 + 1) * 1000,
      userDoc?.streak,
    )
  } catch (error) {
    console.error('Error handling Nez message:', error)
  }
}

export default zenReaction
