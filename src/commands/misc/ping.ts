import { CommandInteraction, SlashCommandBuilder } from 'discord.js'

import { Command } from '@/types'

const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!')

const execute = async (interaction: CommandInteraction): Promise<void> => {
  await interaction.reply({
    content: `Pong! This message had a latency of ${
      Date.now() - interaction.createdTimestamp
    }ms.`,
    ephemeral: true,
  })
}

export default { data, execute } as Command
