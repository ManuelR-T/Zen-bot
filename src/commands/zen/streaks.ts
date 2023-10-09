import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import zenCountSchema from 'schemas/zenCountSchema'

import { Command } from '@/types'
import { newEmbedLeaderboard } from '@/utils'

const data = new SlashCommandBuilder()
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
  )

const execute = async (interaction: CommandInteraction): Promise<void> => {
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
}

const getLastMirrorTime = (): Date => {
  const date = new Date()
  const hour = date.getHours()
  const minute = date.getMinutes()

  if (minute >= hour) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hour,
      hour,
    )
  } else {
    if (hour === 0) {
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 1,
        23,
        23,
      )
    }
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hour - 1,
      hour - 1,
    )
  }
}

const getStreakLeaderboard = async (
  userNb: number,
): Promise<Array<{ name: string; value: string }>> => {
  const lastMirrorTime = getLastMirrorTime()

  const usersToMark = await zenCountSchema.find({
    lastMessageTime: { $ne: lastMirrorTime },
    streak: { $gt: 0 },
  })

  for (const user of usersToMark) {
    user.streak = 0
    await user.save()
  }

  const results = await zenCountSchema
    .find({ streak: { $gt: 0 } })
    .sort({ streak: -1 })
    .limit(userNb)
    .exec()

  return results.map((result) => {
    const streak = result.streak
    let emoji = ''

    if (streak >= 24) {
      emoji = '😴'
    } else if (streak > 6) {
      emoji = '🔥'
    } else if (streak >= 3) {
      emoji = '👨‍🚒'
    } else {
      emoji = '👃'
    }

    return {
      name: `${emoji} ${streak} ${
        streak === 1 ? 'streak' : 'streaks'
      } (best : ${result.bestStreak})`,
      value: `<@${result._id}> `,
      inline: true,
    }
  })
}

export default { data, execute } as Command
