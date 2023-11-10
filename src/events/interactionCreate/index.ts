import { Events, Interaction } from 'discord.js'
import { logger } from 'utils'

import { Event, MyClient } from '@/types'

import { handleCooldown } from './handleCooldown'

const listener = async (interaction: Interaction): Promise<void> => {
  if (interaction.isChatInputCommand()) {
    const client = interaction.client as MyClient

    const command = client.commands.get(interaction.commandName)
    if (!command) {
      logger.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    if (handleCooldown(command, interaction, client.cooldowns)) return

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
}

export default {
  name: Events.InteractionCreate,
  listener,
} as Event
