import { Prisma, PrismaClient } from '@prisma/client'
import { isSameHour, isSameMinute } from 'date-fns'
import { SlashCommandBuilder, CommandInteraction } from 'discord.js'

import { Command } from '@/types'
import { newEmbedLeaderboard, getLastMirrorTime } from '@/utils'
import logger from '@/utils/logger'

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

const prisma = new PrismaClient()

const findUsersToMark = async (
  lastMirrorDate: Date,
): Promise<Pick<Required<Prisma.UserCreateInput>, 'id' | 'lastZen'>[]> => {
  const users = await prisma.user.findMany({
    where: {
      streak: {
        gt: 0,
      },
    },
    select: {
      id: true,
      lastZen: true,
    },
  })

  return users.filter((user) => {
    const userLastZenTime = new Date(user.lastZen)
    return !(
      isSameHour(userLastZenTime, lastMirrorDate) &&
      isSameMinute(userLastZenTime, lastMirrorDate)
    )
  })
}

const updateUserStreak = async (
  userId: string,
  streak: number,
): Promise<void> => {
  prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      streak,
    },
  })
}

const getLeaderboardUsers = async (
  userNb: number,
): Promise<Required<Prisma.UserCreateInput>[]> => {
  return prisma.user.findMany({
    where: {
      streak: {
        gt: 0,
      },
    },
    orderBy: {
      streak: 'desc',
    },
    take: userNb,
  })
}

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
    logger.error('Error getting streak leaderboard:', error)
    interaction.reply('There was an error fetching the leaderboard.')
  }
}

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

export default { data, execute } as Command
