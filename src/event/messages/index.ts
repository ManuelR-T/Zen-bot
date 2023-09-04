import { Message } from 'discord.js'

import { handleNezMessage } from './nez'

export const handleMessages = async (message: Message): Promise<void> => {
  handleNezMessage(message)
}
