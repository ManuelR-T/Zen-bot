import { GatewayIntentBits } from 'discord.js'

import { TOKEN } from './config'
import { handleCommands, handleEvents } from './handlers'
import { MyClient } from './type'

export const client = new MyClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
})

handleCommands(client)
handleEvents(client)

client.login(TOKEN)
