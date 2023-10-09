import { Events, MessageReaction, User } from 'discord.js'

import zenReaction from './zenReaction'

import { Event } from '@/types'

const listener = async (
  reaction: MessageReaction,
  user: User,
): Promise<void> => {
  if (user === null || reaction === null || user.bot) return
  zenReaction(reaction, user)
}

export default {
  name: Events.MessageReactionAdd,
  listener,
} as Event
