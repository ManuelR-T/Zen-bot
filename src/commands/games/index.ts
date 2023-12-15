import { CommandInteraction, SlashCommandBuilder } from 'discord.js'

import { Command } from '@/types'

import subCommandHandler from '../utils/subcommandHandler'
import subcommandMap from './subcommandMap'

const data = new SlashCommandBuilder()
  .setName('games')
  .setDescription('Play games')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('rps')
      .setDescription('Play rock paper scissors')
      .addUserOption((option) =>
        option
          .setName('user')
          .setDescription('The user to play against (optional)')
          .setRequired(false),
      ),
  )

const execute = async (interaction: CommandInteraction): Promise<void> => {
  await subCommandHandler(interaction, subcommandMap)
}

export default { data, execute, cooldown: 10 } as Command
