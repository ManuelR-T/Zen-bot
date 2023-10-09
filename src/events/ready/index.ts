import { Events } from 'discord.js'

import { client } from '../../'

import connectMongo from './connectMongo'

import { MyClient, Event } from '@/types'

const setUserActivity = (): void => {
  if (!client.user) {
    console.error('Failed to get user.')
    process.exit(1)
  }
  client.user.setStatus('online')
}

const listener = async (client: MyClient): Promise<void> => {
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
  await connectMongo()
  console.timeEnd('Startup time')
}

export default {
  name: Events.ClientReady,
  once: true,
  listener,
} as Event
