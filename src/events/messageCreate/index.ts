import { Events, Message } from 'discord.js'

import zenMessage from './zenMessage'

import { Event } from '@/types'

const listener = async (message: Message): Promise<void> => {
  if (message.author.bot) return
  zenMessage(message)
}

export default {
  name: Events.MessageCreate,
  listener,
} as Event
