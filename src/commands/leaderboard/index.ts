import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { newEmbedLeaderboard, logger } from 'utils'

import { getLeaderboard } from './getLeaderboard'

import { Command } from '@/types'

const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Show the Zen leaderboard.')
  .addStringOption((option) =>
    option
      .setName('time')
      .setDescription('The time period to show the leaderboard for.')
      .setRequired(false)
      .addChoices(
        { name: 'All time', value: 'alltime' },
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
  )

const execute = async (interaction: CommandInteraction): Promise<void> => {
  try {
    const hidden = interaction.options.get('hidden')?.value as boolean
    const time =
      ((interaction.options.get('time')?.value as string) || undefined) ??
      'alltime'
    const userNb = interaction.options.get('user_nb')?.value as number | 10
    const leaderboardEntries = await getLeaderboard(time, userNb)
    if (leaderboardEntries.length === 0) {
      interaction.reply('No one has said "zen" yet!')
      return
    }

    const embed = newEmbedLeaderboard({
      title: '🏆 Zen Leaderboard 🏆',
      leaderboardEntries,
      time,
      defaultTime: 'alltime',
      userNb,
      defaultUserNb: 10,
      color: 0x0099ff,
    })

    await interaction.reply({ embeds: [embed], ephemeral: hidden })
  } catch (error) {
    logger.error('Error getting leaderboard:', error)
  }
}

export default { data, execute } as Command
