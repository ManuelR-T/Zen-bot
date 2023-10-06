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
  const oneMinuteAgo = new Date(date.valueOf() - 60 * 1000)
  console.log('date', date)
  console.log('oneMinuteAgo', oneMinuteAgo)
  const res = await zenCountSchema.findOne({
    lastMessageTime: { $gte: oneMinuteAgo },
  })
  console.log('isFirstNose', res)
  return res === null
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

  const currentDate = new Date(message.createdTimestamp)
  const currentTime = currentDate.getTime()
  const isDevil =
    currentDate.getSeconds() >= 55 && (await isFirstNose(currentDate))

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

    const isWithinOneHour = timeSinceLastMessage < 60 * (60 + 1) * 1000
    const queryUpdate = isWithinOneHour
      ? {
          $inc: { streak: 1, count: 1, countWeek: 1, countDay: 1 },
          $max: { bestStreak: userDoc.streak + 1 },
          lastMessageTime: new Date(),
        }
      : {
          $set: { streak: 1 },
          $inc: { count: 1, countWeek: 1, countDay: 1 },
          lastMessageTime: new Date(),
        }

    await updateZenCount(message.author.id, queryUpdate)
  } catch (error) {
    console.error('Error handling Nez message:', error)
  }

  message.react(isDevil ? '😈' : '👃')
}
