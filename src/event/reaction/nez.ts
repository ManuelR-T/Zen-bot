import { MessageReaction, User } from 'discord.js'

//import { NOSE } from '../../config'
import zenCountSchema from '../../schemas/zenCountSchema'
import { isMirrorTime } from '../../utils'

export const handleNezReaction = async (
  reaction: MessageReaction,
  user: User,
): Promise<void> => {
  if (reaction?.message?.author?.id === undefined) return
  if (!isMirrorTime()) return

  const emote = reaction.emoji.name

  //if (emote === null || !NOSE.some(keyword => emote === keyword)) return
  if (emote === null || emote !== '👃') return

  try {
    const userDoc = await zenCountSchema
      .findOne({ _id: reaction.message.author?.id })
      .exec()
    const lastMessageTime: Date = userDoc?.lastMessageTime || new Date(0)

    if (new Date().getTime() - lastMessageTime.getTime() < 1000 * 60) {
      console.log('actual time: ' + new Date())
      console.log('last message time: ' + lastMessageTime)
      console.warn('❌ ' + 'Two nose message in less than 60 sec')
      return
    }

    await zenCountSchema.findOneAndUpdate(
      { _id: user.id },
      { $inc: { count: 1 }, lastMessageTime: new Date() },
      { upsert: true, new: true },
    )
  } catch (error) {
    console.error('❌ ' + 'Error handling Nez message:', error)
  }
}
