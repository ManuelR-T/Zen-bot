import { GatewayIntentBits } from 'discord.js'

import { TOKEN } from './config'
import cron from './cron'
import { handleCommands, handleEvents } from './handlers'
import { MyClient } from './type'
import { WordleManager } from './games/wordle'

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
manager.createGame("hello", "1");
console.log(manager.guess("1", "hella"));
console.log(manager.guess("1", "halmo"));
console.log(manager.guess("1", "helo"));
console.log(manager.guess("1", "hella"));
console.log(manager.guess("1", "halmo"));
console.log(manager.guess("1", "helo"));

client.login(TOKEN)
