import { Events } from 'discord.js'
import mongoose from 'mongoose'

import { client } from '..'
import { MONGO_URI } from '../config'
import betterConsole from '../misc/betterConsole'
import { MyClient } from '../type'

const connectToMongoDB = (): void => {
  console.info('Connecting to the Database')
  try {
    mongoose.connect(MONGO_URI)
  } catch (err) {
    console.error('Failed to connect to MongoDB.')
    process.exit(1)
  }
  console.success('Connected to the Database')
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
  execute(client: MyClient) {
    betterConsole()
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
    setInterval(setUserActivity, 10000)
    console.success('Bot is ready! (' + client?.user?.tag + ')')
    connectToMongoDB()
    console.timeEnd('Startup time')
  },
}
