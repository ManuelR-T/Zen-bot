import { GatewayIntentBits } from 'discord.js'

import { TOKEN } from './config'
import cron from './cron'
import { handleCommands, handleEvents } from './handlers'
import { MyClient } from './type'

console.time('Startup time')
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
cron()

client.login(TOKEN)
