import { Events, Interaction } from 'discord.js'

import { MyClient, Event } from '@/types'
import logger from '@/utils/logger'

const listener = async (interaction: Interaction): Promise<void> => {
  if (!interaction.isChatInputCommand()) return

  const client = interaction.client as MyClient
  const command = client.commands.get(interaction.commandName)

  if (!command) {
    logger.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    logger.error(error)
    await interaction.followUp({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    })
  }
}

export default {
  name: Events.InteractionCreate,
  listener,
} as Event
