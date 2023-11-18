import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
} from 'discord.js'
import { logger, newEmbedLeaderboard } from 'utils'

import addCollector from './addCollector'
import { getLeaderboard } from './getLeaderboard'

const execute = async (interaction: CommandInteraction): Promise<void> => {
  try {
    const hidden =
      (interaction.options.get('hidden')?.value as boolean | undefined) ?? false
    await interaction.deferReply({ ephemeral: hidden })
    const time =
      (interaction.options.get('time')?.value as string | undefined) ??
      'all-time'
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
      defaultTime: 'all-time',
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

    await addCollector(message, row, time, userNb)
  } catch (error) {
    logger.error('Error getting leaderboard:', error)
  }
}

export default execute
