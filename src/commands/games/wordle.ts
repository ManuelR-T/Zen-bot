import { SlashCommandBuilder } from '@discordjs/builders'

import { Command } from '../../type'

export default {
  data: new SlashCommandBuilder()
    .setName('wordle')
    .setDescription('Play your daily wordle game!')
    .addStringOption((option) =>
      option
        .setName('action')
        .setDescription('Guess the word!')
        .setRequired(true)
        .addChoices(
          { name: 'Start', value: 'start' },
          { name: 'Guess', value: 'guess' },
        ),
      )
    ,
  async execute(interaction) {
    if (interaction.options.get('action')?.value === 'start') {
      await interaction.reply({
        content: `Not implemented yet!`,
        ephemeral: true,
      })
      return
    }
    if (interaction.options.get('action')?.value === 'guess') {
      await interaction.reply({
        content: `Not implemented yet!`,
        ephemeral: true,
      })
      return
    }
  },
} as Command
