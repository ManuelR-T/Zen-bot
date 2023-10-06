import { Events } from 'discord.js'
import mongoose from 'mongoose'

import { client } from '..'
import { MONGO_URI } from '../config'
import { MyClient } from '../type'

const connectToMongoDB = async (): Promise<void> => {
  console.info('Connecting to the Database')
  try {
    await mongoose.connect(MONGO_URI)
  } catch (err) {
    console.error('Failed to connect to MongoDB.', err)
    process.exit(1)
  }
  console.log('Connected to the Database')
}

const setUserActivity = (): void => {
  if (!client.user) {
    console.error('Failed to get user.')
    process.exit(1)
  }
  client.user.setStatus('online')
}

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: MyClient) {
    if (!client) {
      console.error('Failed to create client.')
      process.exit(1)
    }
    if (!client.user) {
      console.error('Failed to get user.')
      process.exit(1)
    }
    console.info('Tune the discord bot')

    setUserActivity()
    console.log('Bot is ready! (' + client?.user?.tag + ')')
    await connectToMongoDB()
    console.timeEnd('Startup time')
  },
}
