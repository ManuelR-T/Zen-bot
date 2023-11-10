import { Events } from 'discord.js'
import { logger } from 'utils'

import { Event, MyClient } from '@/types'

import { client } from '../../'

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
}

export default {
  name: Events.ClientReady,
  once: true,
  listener,
} as Event
