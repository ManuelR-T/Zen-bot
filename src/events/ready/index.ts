import { Events } from 'discord.js'

import connectMongo from './connectMongo'
import { client } from '../../'

import { MyClient, Event } from '@/types'
import logger from '@/utils/logger'

const setUserActivity = (): void => {
  if (!client.user) {
    logger.error('Failed to get user.')
    process.exit(1)
  }
  client.user.setStatus('online')
}

const listener = async (client: MyClient): Promise<void> => {
  if (!client) {
    logger.error('Failed to create client.')
    process.exit(1)
  }
  if (!client.user) {
    logger.error('Failed to get user.')
    process.exit(1)
  }
  logger.info('Tune the discord bot')

  setUserActivity()
  logger.info('Bot is ready! (' + client?.user?.tag + ')')
  await connectMongo()
}

export default {
  name: Events.ClientReady,
  once: true,
  listener,
} as Event
