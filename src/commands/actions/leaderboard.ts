import zenCountSchema from '../../schemas/zenCountSchema'
import { Message, EmbedBuilder } from 'discord.js'

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

export const leaderboard = async (
  message: Message,
  args: string[],
): Promise<void> => {
  if (args.length > 0) {
    message.reply('Invalid command. Usage: !leaderboard')
    return
  }
  try {
    const leaderboardEntries = await getLeaderboard()
    if (leaderboardEntries.length === 0) {
      message.reply('No one has said "zen" yet!')
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

    message.channel.send({ embeds: [embed] })
  } catch (error) {
    console.error('Error getting leaderboard:', error)
  }
}
