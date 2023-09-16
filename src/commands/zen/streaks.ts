import { SlashCommandBuilder } from '@discordjs/builders'

import zenCountSchema from '../../schemas/zenCountSchema'
import { Command, CommandExecute } from '../../type'
import { newEmbedLeaderboard } from '../../utils'

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

const execute : CommandExecute = async (interaction) => {
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

const getStreakLeaderboard = async (
  userNb: number
): Promise<Array<{ name: string; value: string }>> => {
  const currentTime = new Date().getTime();
  const usersToMark = await zenCountSchema.find({
    lastMessageTime: { $lt: currentTime - 61 * 1000 },
    streak: { $gt: 0 },
  });

  setTimeout(async () => {
    for (const user of usersToMark) {
      const lastMessageTime = user.lastMessageTime.getTime();
      if (lastMessageTime < currentTime - 61 * 1000) {
        user.streak = 0;
        await user.save();
      }
    }
  }, 60 * 1000);

  const results = await zenCountSchema
    .find({ streak: { $gt: 0 } })
    .sort({ streak: -1 })
    .limit(userNb)
    .exec();

  return results.map((result) => {
    const streak = result.streak;
    let emoji = "";

    if (streak >= 6) {
      emoji = "🔥";
    } else if (streak >= 3) {
      emoji = "👨‍🚒";
    } else {
      emoji = "👃";
    }

    return {
      name: `${emoji} ${streak} ${
        streak === 1 ? "streak" : "streaks"
      } (best : ${result.bestStreak})`,
      value: `<@${result._id}> `,
      inline: true,
    };
  });
};

export default { data, execute } as Command