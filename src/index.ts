import { GatewayIntentBits } from 'discord.js'

import { TOKEN } from './config'
import cron from './cron'
import { WordleManager } from './games/wordle'
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

const manager = new WordleManager();
manager.createGame("argent", "1");

const asyncc = async (id , word) => {
  try {
    console.log(await manager.guess(id, word));
  }
  catch (error) {
    console.log(error);
  }
}

asyncc("1", "agents")
asyncc("1", "argent")
asyncc("1", "arpent")
asyncc("1", "argent")
asyncc("1", "Argent")

client.login(TOKEN)
