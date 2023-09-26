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

const isFirstNose = async (date: Date): Promise<number> => {
  const res = await zenCountSchema.findOne({
    lastMessageTime: { $lte: date.getMilliseconds() - 60 * 1000 },
  })
  return res === undefined ? 1 : 0
}

const handleNezMessage = async (message: Message): Promise<void> => {
  const currentDate = new Date()
  const currentTime = currentDate.getTime()
  if (!isMirrorTime()) return

  const content = message.content.toLowerCase()

  if (!NOSE.some((keyword) => content.includes(keyword))) return

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
  const isDevil = currentDate.getSeconds() >= 55 && isFirstNose(currentDate)
  message.react(isDevil ? '😈' : '👃')
}
