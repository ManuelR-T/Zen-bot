import { Events, Message } from 'discord.js'

import { NOSE } from '../config'
import zenCountSchema from '../schemas/zenCountSchema'
import { isMirrorTime } from '../utils'

export default {
  name: Events.MessageCreate,
  execute: async (message: Message) => {
    if (message.author.bot) return
    handleNezMessage(message)
  },
}

const handleNezMessage = async (message: Message): Promise<void> => {
  if (!isMirrorTime()) return

  const content = message.content.toLowerCase()

  if (!NOSE.some((keyword) => content.includes(keyword))) return

  const currentTime = new Date().getTime()
  try {
    const userDoc = await zenCountSchema
      .findOne({ _id: message.author.id })
      .exec()
    const lastMessageTime: Date = userDoc?.lastMessageTime || new Date(0)

    if (currentTime - lastMessageTime.getTime() < 1000 * 60) {
      console.log('actual time: ' + new Date())
      console.log('last message time: ' + lastMessageTime)
      console.warn('Two nose message in less than 60 sec')
      return
    }

    if (currentTime - lastMessageTime.getTime() < 1000 * 60 * 63) {
      await zenCountSchema.findOneAndUpdate(
        { _id: message.author.id },
        {
          $inc: { streak: 1 },
          $max: { bestStreak: userDoc.streak + 1 },
        },
        { upsert: true, new: true },
      )
    } else {
      await zenCountSchema.findOneAndUpdate(
        { _id: message.author.id },
        {
          $set: { streak: 1 },
        },
        { upsert: true, new: true },
      )
    }

    await zenCountSchema.findOneAndUpdate(
      { _id: message.author.id },
      {
        $inc: { count: 1, countWeek: 1, countDay: 1 },
        lastMessageTime: new Date(),
      },
      { upsert: true, new: true },
    )
  } catch (error) {
    console.error('Error handling Nez message:', error)
  }
  message.react('👃')
}
