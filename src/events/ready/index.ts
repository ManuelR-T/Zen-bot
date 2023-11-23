import { ActivityType, Events } from 'discord.js'
import { logger } from 'utils'

import { Event, MyClient } from '@/types'

const setUserActivity = (client: MyClient): void => {
  if (!client.user) {
    logger.error('Failed to get user.')
    process.exit(1)
  }
  const arrayOfCommands = Array.from(client.commands.keys())

  client.user.setStatus('online')
  client.user.setActivity({
    name: `Try /${
      arrayOfCommands[Math.floor(Math.random() * arrayOfCommands.length)]
    }`,
    type: ActivityType.Custom,
  })
}

const listener = async (client: MyClient): Promise<void> => {
  if (!client) {
    logger.error('Failed to create client.')
    process.exit(1)
  }

  logger.info('Tune the discord bot')
  setUserActivity(client)
  setTimeout(() => {
    setUserActivity(client)
  }, 600000)

  logger.info(`Bot is ready! (${client.user?.tag})`)
}

export default {
  name: Events.ClientReady,
  once: true,
  listener,
} as Event
