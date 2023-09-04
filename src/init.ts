import { Client, Message, GatewayIntentBits, ActivityType, MessageReaction, User, PartialMessageReaction, PartialUser } from 'discord.js'
import mongoose from 'mongoose'

import { MONGO_URI } from './config'
import { commandActions } from './event/commands'

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
})

export const initializeBot = (
  handleMessages: (message: Message) => Promise<void>,
  handleReaction: (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
  ) => Promise<void>,
): void => {
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
  client.on('messageCreate', handleMessages)
  client.on('messageReactionAdd', handleReaction)
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
  const status = Object.keys(commandActions).map(
    cmd => '!' + cmd + ': ' + commandActions[cmd].desc,
  )
  const random = Math.floor(Math.random() * (status.length - 1) * 2)
  const randomStatus =
    random > status.length ? status[0] : status[random % status.length]
  client.user.setStatus('online')
  client.user.setActivity(randomStatus, { type: ActivityType.Custom })
  console.log('ℹ️  ' + 'Set user activity to ' + randomStatus)
}
