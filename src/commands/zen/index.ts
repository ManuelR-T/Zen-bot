import { CommandInteraction, SlashCommandBuilder } from 'discord.js'

import { Command } from '@/types'

import subCommandHandler from '../utils/subcommandHandler'
import subcommandMap from './subcommandMap'

const data = new SlashCommandBuilder()
  .setName('zen')
  .setDescription('Zen commands.')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('leaderboard')
      .setDescription('Show the Zen leaderboard.')
      .addStringOption((option) =>
        option
          .setName('time')
          .setDescription('The time period to show the leaderboard for.')
          .setRequired(false)
          .addChoices(
            { name: 'All time', value: 'all-time' },
            { name: 'This week', value: 'weekly' },
            { name: 'Today', value: 'daily' },
          ),
      )
      .addNumberOption((option) =>
        option
          .setName('user_nb')
          .setDescription(
            'The number of users to show in the leaderboard. Min 1, max 20.',
          )
          .setRequired(false)
          .setMaxValue(20)
          .setMinValue(1),
      )
      .addBooleanOption((option) =>
        option
          .setName('hidden')
          .setDescription('Hide the command from other users.')
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('streak')
      .setDescription('Show the Streak Leaderboard.')
      .addNumberOption((option) =>
        option
          .setName('user_nb')
          .setDescription(
            'The number of users to show in the leaderboard. Min 1, max 20.',
          )
          .setRequired(false)
          .setMaxValue(20)
          .setMinValue(1),
      )
      .addBooleanOption((option) =>
        option
          .setName('hidden')
          .setDescription('Hide the command from other users.')
          .setRequired(false),
      ),
  )

const execute = async (interaction: CommandInteraction): Promise<void> => {
  await subCommandHandler(interaction, subcommandMap)
}

export default { data, execute, cooldown: 5 } as Command
