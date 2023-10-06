import { Events, Message } from 'discord.js'
import { UpdateQuery } from 'mongoose'

import { NOSE } from '../config'
import zenCountSchema, { IZenCount } from '../schemas/zenCountSchema'
import { isMirrorTime } from '../utils'

export default {
  name: Events.MessageCreate,
  execute: async (message: Message) => {
    if (message.author.bot) return
    handleNezMessage(message)
  },
}

const isFirstNose = async (date: Date): Promise<boolean> => {
  const oneMinuteAgo = new Date(date.getTime() - 60 * 1000)
  const res = await zenCountSchema.findOne({
    lastMessageTime: { $lte: oneMinuteAgo },
  })
  return res === undefined ? false : res
}

const updateZenCount = async (
  userId: string,
  updates: UpdateQuery<IZenCount>,
): Promise<void> => {
  await zenCountSchema.findOneAndUpdate({ _id: userId }, updates, {
    upsert: true,
    new: true,
  })
}

const IsZenMessage = (message: Message): boolean => {
  if (!isMirrorTime()) return false

  if (!NOSE.some((keyword) => message.content.toLowerCase().includes(keyword)))
    return false

  return true
}

const handleNezMessage = async (message: Message): Promise<void> => {
  if (!IsZenMessage(message)) return

  const currentDate = new Date()
  const currentTime = currentDate.getTime()

  try {
    const userDoc = await zenCountSchema
      .findOne({ _id: message.author.id })
      .exec()
    const lastMessageTime: Date = userDoc?.lastMessageTime || new Date(0)
    const timeSinceLastMessage = currentTime - lastMessageTime.getTime()

    if (timeSinceLastMessage < 60 * 1000) {
      console.warn('2 zen msgs < 60 sec', new Date(), lastMessageTime)
      return
    }

    const isWithinOneHour = timeSinceLastMessage < 60 * 60 * 1000
    const streakUpdate = isWithinOneHour
      ? { $inc: { streak: 1 }, $max: { bestStreak: userDoc.streak + 1 } }
      : { $set: { streak: 1 } }

    await updateZenCount(message.author.id, streakUpdate)

    await updateZenCount(message.author.id, {
      $inc: { count: 1, countWeek: 1, countDay: 1 },
      lastMessageTime: new Date(),
    })
  } catch (error) {
    console.error('Error handling Nez message:', error)
  }

  const isDevil =
    currentDate.getSeconds() >= 55 && (await isFirstNose(currentDate))
  message.react(isDevil ? '😈' : '👃')
}
