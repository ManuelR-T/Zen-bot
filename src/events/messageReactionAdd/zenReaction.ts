import { MessageReaction, User } from 'discord.js'
import zenCountSchema from 'schemas/zenCountSchema'

import { NOSE } from '@/config'
import { isMirrorTime } from '@/utils'

const zenReaction = async (
  reaction: MessageReaction,
  user: User,
): Promise<void> => {
  if (!isMirrorTime()) return
  if (reaction.message?.author?.id === undefined) return

  const emote = reaction.emoji.name

  if (emote === null || !NOSE.some((keyword) => emote === keyword)) return

  try {
    const userDoc = await zenCountSchema
      .findOne({ _id: reaction.message.author?.id })
      .exec()
    const lastMessageTime: Date = userDoc?.lastMessageTime || new Date(0)

    if (new Date().getTime() - lastMessageTime.getTime() < 1000 * 60) {
      console.warn(
        '2 zen msgs / reaction < 60 sec',
        new Date(),
        lastMessageTime,
      )
      return
    }

    await zenCountSchema.findOneAndUpdate(
      { _id: user.id },
      {
        $inc: { count: 1, countWeek: 1, countDay: 1 },
        lastMessageTime: new Date(),
      },
      { upsert: true, new: true },
    )
  } catch (error) {
    console.error('Error handling Nez message:', error)
  }
}

export default zenReaction
