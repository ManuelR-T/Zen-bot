import { ActionRowBuilder, ButtonBuilder, Message } from 'discord.js'

import { newEmbedLeaderboard } from '@/utils'

import { getLeaderboard } from './getLeaderboard'

export default async (
  message: Message,
  row: ActionRowBuilder<ButtonBuilder>,
  time: string,
  userNb: number,
): Promise<void> => {
  const collector = message.createMessageComponentCollector({
    time: 120000,
  })

  collector.on('collect', async (i) => {
    if (i.customId !== 'leaderboard:refresh') return
    const leaderboardEntries = await getLeaderboard(time, userNb)
    const embed = newEmbedLeaderboard({
      title: '🏆 Zen Leaderboard 🏆',
      leaderboardEntries,
      time,
      defaultTime: 'all-time',
      userNb,
      defaultUserNb: 10,
      color: 0x0099ff,
    })
    await i.update({
      embeds: [
        embed.setFooter({
          text: 'Last updated',
          iconURL:
            i.user.avatarURL() ||
            'https://t3.ftcdn.net/jpg/04/30/88/00/360_F_430880079_xhvaasQ8uUeP7PyYLDY8jwZvQ3mekZFY.jpg',
        }),
      ],
      components: [row],
    })
  })

  collector.on('end', async () => {
    row.components[0].setDisabled(true)
    await message.edit({
      components: [row],
    })
  })
}
