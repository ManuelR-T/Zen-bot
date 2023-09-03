import { Message } from 'discord.js'
import zenCountSchema from '../schemas/zenCountSchema'
import { NOSE } from '../config'

const isDSTinParis = (date: Date) => {
  // Daylight Saving Time starts on the last Sunday of March
  const dstStart = new Date(date.getFullYear(), 2, 31, 2 - 1)
  dstStart.setDate(31 - dstStart.getDay())

  // Daylight Saving Time ends on the last Sunday of October
  const dstEnd = new Date(date.getFullYear(), 9, 31, 3 - 1)
  dstEnd.setDate(31 - dstEnd.getDay())

  return date >= dstStart && date < dstEnd
}

const isMirrorTime = (): boolean => {
  let now = new Date()
  const gmt = now.getTimezoneOffset() / 60
  const offset = isDSTinParis(now) ? 2 : 1

  now = new Date(now.getTime() + (offset + gmt) * 3600000)

  return now.getHours() === now.getMinutes()
}

const handleNezMessage = async (message: Message): Promise<void> => {
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

export default handleNezMessage
