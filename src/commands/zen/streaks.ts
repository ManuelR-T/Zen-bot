import { SlashCommandBuilder } from '@discordjs/builders'

import zenCountSchema from '../../schemas/zenCountSchema'
import { Command } from '../../type'
import { newEmbedLeaderboard } from '../../utils'

const updateStreaks = async () => {
  const users = await zenCountSchema.find({})
  const currentTime = new Date().getTime()
  const oneHourOneMinuteAgo = new Date(currentTime - 61 * 60 * 1000)

  for (const user of users) {
    if (user.lastMessageTime.getTime() < oneHourOneMinuteAgo) {
      user.streak = 0
      await user.save()
    }
  }
}

const getStreakLeaderboard = async (
  userNb: number,
): Promise<Array<{ name: string; value: string }>> => {
  await updateStreaks()

  const results = await zenCountSchema
    .find({ streak: { $gt: 0 } })
    .sort({ streak: -1 })
    .limit(userNb)
    .exec()

  return results.map((result) => {
    const streak = result.streak
    let emoji = ''

    if (streak >= 6) {
      emoji = '🔥'
    } else if (streak >= 3) {
      emoji = '👨‍🚒'
    } else {
      emoji = '👃'
    }

    return {
      name: `${emoji} ${streak} ${streak === 1 ? 'streak' : 'streaks'}`,
      value: `<@${result._id}> `,
      inline: true,
    }
  })
}

export default {
  data: new SlashCommandBuilder()
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
  async execute(interaction) {
    try {
      const hidden = interaction.options.get('hidden')?.value as boolean
      const userNb = interaction.options.get('user_nb')?.value as number | 10
      const leaderboardEntries = await getStreakLeaderboard(userNb)
      if (leaderboardEntries.length === 0) {
        interaction.reply('No one has any streaks yet!')
        return
      }

      const embed = newEmbedLeaderboard({
        title: '🔥 Streak Leaderboard 🔥',
        leaderboardEntries,
        userNb,
        defaultUserNb: 10,
      })

      await interaction.reply({ embeds: [embed], ephemeral: hidden })
    } catch (error) {
      console.error('Error getting streak leaderboard:', error)
    }
  },
} as Command
