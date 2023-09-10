import { SlashCommandBuilder } from '@discordjs/builders'

import { Command } from '../../type'

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply({
      content: `Pong! This message had a latency of ${
        Date.now() - interaction.createdTimestamp
      }ms.`,
      ephemeral: true,
    })
  },
} as Command
