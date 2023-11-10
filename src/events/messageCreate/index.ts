import { Events, Message } from 'discord.js'

import { Event } from '@/types'

import ZenMessageHandler from './zenMessageHandler'

const zenMessageHandler = new ZenMessageHandler()

const listener = async (message: Message): Promise<void> => {
  if (message.author.bot) return
  await zenMessageHandler.handleMessage(message)
}

export default {
  name: Events.MessageCreate,
  listener,
} as Event
