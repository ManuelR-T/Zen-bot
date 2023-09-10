import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders'

import zenCountSchema from '../../schemas/zenCountSchema'
import { Command } from '../../type'

const getLeaderboard = async (): Promise<
  Array<{ name: string; value: string }>
> => {
  const results = await zenCountSchema
    .find({})
    .sort({ count: -1 })
    .limit(10)
    .exec()

  return results.map((result, index) => {
    const rankIcon =
      index < 3 ? ['🥇', '🥈', '🥉'][index] : (index + 1).toString() + '.   '
    return {
      name: `${rankIcon}          ${result.count} ${
        result.count === 1 ? 'time' : 'times'
      }`,
      value: `<@${result._id}> `,
      inline: true,
    }
  })
}

export default {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show the Zen leaderboard.'),
  async execute(interaction) {
    try {
      const leaderboardEntries = await getLeaderboard()
      if (leaderboardEntries.length === 0) {
        interaction.reply('No one has said "zen" yet!')
        return
      }

      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('🏆 Zen Leaderboard')
        .setFooter({
          text: 'Last updated',
        })
        .setTimestamp()

      embed.addFields(...leaderboardEntries)

      await interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.error('Error getting leaderboard:', error)
    }
  },
} as Command
