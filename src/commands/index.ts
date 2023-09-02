import { Message } from 'discord.js'
import { leaderboard } from './leaderboard'

export const handleCommands = (
  message: Message,
  command: string,
  args: string[],
): void => {
  switch (command) {
    case 'help':
      message.reply('Commands: !help, !ping, !server, !leaderboard')
      break
    case 'ping':
      message.reply(
        `Pong! This message had a latency of ${
          Date.now() - message.createdTimestamp
        }ms.`,
      )
      break
    case 'server':
      message.reply(`This server's name is: ${message.guild?.name}`)
      break
    case 'leaderboard':
      leaderboard(message, args)
      break
    default:
      message.reply('Invalid command. Usage: !help')
  }
}
