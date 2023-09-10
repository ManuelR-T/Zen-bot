import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders'

import zenCountSchema from '../../schemas/zenCountSchema'
import { Command } from '../../type'

const getLeaderboard = async (time:string): Promise<
  Array<{ name: string; value: string }>
> => {
  let sortfield = 'count'
  if (time === 'weekly') {
    sortfield = 'countWeek'
  } else if (time === 'dayly') {
    sortfield = 'countDay'
  }
  const results = await zenCountSchema
    .find({ [sortfield]: { $gt: 0 } })
    .sort({ [sortfield]: -1 })
    .limit(10)
    .exec()

  return results.map((result, index) => {
    const rankIcon =
      index < 3 ? ['🥇', '🥈', '🥉'][index] : (index + 1).toString() + '.   '
    const count = result[sortfield]
    return {
      name: `${rankIcon}          ${count} ${
        count === 1 ? 'time' : 'times'
      }`,
      value: `<@${result._id}> `,
      inline: true,
    }
  })
}

export default {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show the Zen leaderboard.')
    .addStringOption(option =>
      option
        .setName('time')
        .setDescription('The time period to show the leaderboard for.')
        .setRequired(false)
        .addChoices(
          { name: 'All time', value: 'alltime' },
          { name: 'This week', value: 'weekly' },
          { name: 'Today', value: 'dayly' },
        ),
    ),
  async execute(interaction) {
    try {
      const time = (interaction.options.get('time')?.value as string || undefined) ?? 'alltime'
      const leaderboardEntries = await getLeaderboard(time)
      if (leaderboardEntries.length === 0) {
        interaction.reply('No one has said "zen" yet!')
        return
      }

      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('🏆 Zen Leaderboard' + (time === 'alltime' ? '' : ` (${time})`))
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
