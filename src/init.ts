import fs from 'fs'
import path from 'path'

import { Client, GatewayIntentBits, Collection } from 'discord.js'
import mongoose from 'mongoose'

import { MONGO_URI } from './config'
import { Command } from './index.d'

class MyClient extends Client {
  commands = new Collection<string, Command>()
}

export const client = new MyClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
})

const loadCommands = async () => {
  const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'))
  const foldersPath = path.join(__dirname, 'commands')
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter(file => file.endsWith('.js') || file.endsWith('.ts'))
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file)
      try {
        const { default: command } = await import(filePath)
        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command)
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
          )
        }
      } catch (error) {
        console.error(`[ERROR] Failed to load command at ${filePath}:`, error)
      }
    }
  }
}

loadCommands()

export const initializeBot = (): void => {
  if (!client) {
    console.error('❌ ' + 'Failed to create client.')
    process.exit(1)
  }
  if (!client.user) {
    console.error('❌ ' + 'Failed to get user.')
    process.exit(1)
  }
  console.log('ℹ️  ' + 'Tune the discord bot')

  setUserActivity()
  setInterval(setUserActivity, 10000)
  console.log('✅ ' + 'Bot is ready! (' + client?.user?.tag + ')')
  connectToMongoDB()
}

const connectToMongoDB = (): void => {
  console.log('ℹ️  ' + 'Connecting to the Database')
  try {
    mongoose.connect(MONGO_URI, { keepAlive: true })
  } catch (err) {
    console.error('❌ ' + 'Failed to connect to MongoDB.')
    process.exit(1)
  }
  console.log('✅ ' + 'Connected to the Database')
}

const setUserActivity = (): void => {
  if (!client.user) {
    console.error('❌ ' + 'Failed to get user.')
    process.exit(1)
  }
  client.user.setStatus('online')
}
