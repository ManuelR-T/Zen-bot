import { Message } from 'discord.js'
import zenCountSchema, { IZenCount } from 'schemas/zenCountSchema'

import { NOSE } from '@/config'
import { isMirrorTime, incZenCount } from '@/utils'

const isFirstNose = async (date: Date): Promise<boolean> => {
  const oneMinuteAgo = new Date(date.getTime() - 60 * 1000)
  try {
    const res: Pick<IZenCount, '_id'> | null = await zenCountSchema
      .findOne({ lastMessageTime: { $gte: oneMinuteAgo } })
      .select('_id')
      .exec()
    return res === null
  } catch (error) {
    console.error(error)
    throw new Error('Database operation failed')
  }
}

const isZenMessage = (message: Message, date: Date): boolean => {
  return (
    isMirrorTime(date) &&
    NOSE.some((keyword) => message.content.toLowerCase().includes(keyword))
  )
}

const zenMessage = async (message: Message): Promise<void> => {
  const currentDate = new Date(message.createdTimestamp)

  if (!isZenMessage(message, currentDate)) return

  const userDoc: Pick<IZenCount, 'lastMessageTime' | 'streak'> | null =
    await zenCountSchema
      .findOne({ _id: message.author.id })
      .select('lastMessageTime streak')
      .exec()

  const lastMessageTime: Date = userDoc?.lastMessageTime || new Date(0)
  const timeSinceLastMessage = currentDate.getTime() - lastMessageTime.getTime()

  if (timeSinceLastMessage < 60 * 1000) {
    console.log('2 zen msgs < 60 sec', currentDate, lastMessageTime)
    return
  }

  await incZenCount(
    message.author.id,
    currentDate,
    timeSinceLastMessage < 60 * (60 + 1) * 1000,
    userDoc?.streak,
  )

  message.react(
    currentDate.getSeconds() >= 55 && (await isFirstNose(currentDate))
      ? '😈'
      : '👃',
  )
}

export default zenMessage
