import { Message, Events } from 'discord.js'

import { TOKEN } from './config'
import { handleMessages } from './event'
import handleReaction from './event/reaction'
import { initializeBot, client } from './init'
import { handleInteraction } from './handleInteraction'

const handleMessagesCommands = async (message: Message): Promise<void> => {
  if (message.author.bot) return
  handleMessages(message)
}

client.once(Events.ClientReady, () => initializeBot())
client.on(Events.InteractionCreate, handleInteraction)
client.on(Events.MessageCreate, handleMessagesCommands)
client.on(Events.MessageReactionAdd, handleReaction)
client.login(TOKEN)
