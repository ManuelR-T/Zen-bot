import {
  SlashCommandBuilder,
  CommandInteraction,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from 'discord.js'
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
    const hidden =
      (interaction.options.get('hidden')?.value as boolean | undefined) ?? false
    await interaction.deferReply({ ephemeral: hidden })
    const time =
      (interaction.options.get('time')?.value as string | undefined) ??
      'alltime'
    const userNb =
      (interaction.options.get('user_nb')?.value as number | undefined) ?? 10
    const leaderboardEntries = await getLeaderboard(time, userNb)
    if (leaderboardEntries.length === 0) {
      interaction.followUp('No one has said "zen" yet!')
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

    if (hidden) {
      await interaction.followUp({
        embeds: [embed],
      })
      return
    }

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`leaderboard:refresh`)
        .setLabel('Refresh')
        .setEmoji('🔄')
        .setStyle(ButtonStyle.Primary),
    )

    const message = await interaction.followUp({
      embeds: [embed],
      ephemeral: hidden,
      components: [row],
    })

    const collector = message.createMessageComponentCollector({
      time: 120000,
    })

    collector.on('collect', async (i) => {
      const leaderboardEntries = await getLeaderboard(time, userNb)
      const embed = newEmbedLeaderboard({
        title: '🏆 Zen Leaderboard 🏆',
        leaderboardEntries,
        time,
        defaultTime: 'alltime',
        userNb,
        defaultUserNb: 10,
        color: 0x0099ff,
      })
      await i.update({
        embeds: [embed],
        components: [row],
      })
    })

    collector.on('end', async () => {
      row.components[0].setDisabled(true)
      await message.edit({
        components: [row],
      })
    })
  } catch (error) {
    logger.error('Error getting leaderboard:', error)
  }
}

export default { data, execute, cooldown: 5 } as Command
