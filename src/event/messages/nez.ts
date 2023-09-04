import { Message } from 'discord.js'

import { NOSE } from '../../config'
import zenCountSchema from '../../schemas/zenCountSchema'
import { isMirrorTime } from '../../utils'

export const handleNezMessage = async (message: Message): Promise<void> => {
  if (!isMirrorTime()) return

  const content = message.content.toLowerCase()

  if (!NOSE.some(keyword => content.includes(keyword))) return

  try {
    const userDoc = await zenCountSchema
      .findOne({ _id: message.author.id })
      .exec()
    const lastMessageTime: Date = userDoc?.lastMessageTime || new Date(0)

    if (new Date().getTime() - lastMessageTime.getTime() < 1000 * 60) {
      console.log('actual time: ' + new Date())
      console.log('last message time: ' + lastMessageTime)
      console.warn('❌ ' + 'Two nose message in less than 60 sec')
      return
    }

    await zenCountSchema.findOneAndUpdate(
      { _id: message.author.id },
      { $inc: { count: 1 }, lastMessageTime: new Date() },
      { upsert: true, new: true },
    )
  } catch (error) {
    console.error('❌ ' + 'Error handling Nez message:', error)
  }
  message.react('👃')
}
