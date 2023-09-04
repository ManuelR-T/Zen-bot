import {
  MessageReaction,
  User,
  PartialMessageReaction,
  PartialUser,
} from 'discord.js'

import { handleNezReaction } from './nez'

const handleReaction = async (
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
): Promise<void> => {
  if (user === null || user.partial || reaction === null || reaction.partial)
    return
  handleNezReaction(reaction, user)
}

export default handleReaction
