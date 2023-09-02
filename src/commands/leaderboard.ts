import zenCountSchema from '../schemas/zenCountSchema'
import { Message } from 'discord.js'

const getLeaderboard = async (): Promise<string> => {
  const results = await zenCountSchema
    .find({})
    .sort({ count: -1 })
    .limit(10)
    .exec()

  return results
    .map(
      (
        result: {
          _id: string
          __v: number
          count: number
          lastMessageTime: Date
        },
        index: number,
      ) => {
        return `${index + 1}. <@${result._id}>: ${result.count} ${
          result.count === 1 ? 'time' : 'times'
        }`
      },
    )
    .join('\n')
}

const leaderboard = async (message: Message, args: string[]): Promise<void> => {
  if (args.length > 0) {
    message.reply('Invalid command. Usage: !leaderboard')
    return
  }
  try {
    const leaderboard = await getLeaderboard()
    if (leaderboard.length === 0) {
      message.reply('No one has said "zen" yet!')
      return
    }
    message.reply(`${leaderboard}`)
  } catch (error) {
    console.error('Error getting leaderboard:', error)
  }
}

export { leaderboard }
