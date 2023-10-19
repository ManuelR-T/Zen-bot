import { GatewayIntentBits } from 'discord.js'

import cron from './cron'
import { handleCommands, handleEvents } from './handlers'
import { MyClient } from './types'

import Config from '@/config'

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

client.login(Config.TOKEN)
