import { CommandInteraction } from 'discord.js'
import { getLastMirrorTime, logger, newEmbedLeaderboard } from 'utils'

import {
  findUsersToMark,
  getLeaderboardUsers,
  updateUserStreak,
} from './dbOperations'

const getStreakLeaderboard = async (
  userNb: number,
): Promise<Array<{ name: string; value: string }>> => {
  const lastMirrorTime = getLastMirrorTime()

  const usersToMark = await findUsersToMark(lastMirrorTime)
  for (const user of usersToMark) {
    await updateUserStreak(user.id, 0)
  }

  const results = await getLeaderboardUsers(userNb)

  return results.map((result) => {
    const streak = result.streak
    let emoji = '👃'

    if (streak >= 24) {
      emoji = '😴'
    } else if (streak > 6) {
      emoji = '🔥'
    } else if (streak >= 3) {
      emoji = '👨‍🚒'
    }

    return {
      name: `${emoji} ${streak} ${
        streak === 1 ? 'streak' : 'streaks'
      } (best : ${result.bestStreak})`,
      value: `<@${result.id}> `,
      inline: true,
    }
  })
}

const execute = async (interaction: CommandInteraction): Promise<void> => {
  try {
    const hidden = interaction.options.get('hidden')?.value as boolean
    await interaction.deferReply({ ephemeral: hidden })
    const userNb = interaction.options.get('user_nb')?.value as number | 10

    const leaderboardEntries = await getStreakLeaderboard(userNb)

    if (leaderboardEntries.length === 0) {
      interaction.followUp('No one has any streaks yet!')
      return
    }

    const embed = newEmbedLeaderboard({
      title: '🔥 Streak Leaderboard 🔥',
      leaderboardEntries,
      userNb,
      defaultUserNb: 10,
    })

    await interaction.followUp({ embeds: [embed], ephemeral: hidden })
  } catch (error) {
    logger.error('Error getting streak leaderboard:', error)
    interaction.followUp('There was an error fetching the leaderboard.')
  }
}

export default execute
