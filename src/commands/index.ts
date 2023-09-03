import { Message } from 'discord.js'
import { leaderboard, help, ping, github } from './actions'

export const commandActions: {
  [command: string]: {
    action: (message: Message, args: string[]) => void
    desc: string
  }
} = {
  help: {
    action: message => help(message),
    desc: 'Displays the commands',
  },
  ping: {
    action: message => ping(message),
    desc: "Checks the bot's latency",
  },
  leaderboard: {
    action: (message, args) => leaderboard(message, args),
    desc: 'Shows the leaderboard',
  },
  github: {
    action: message => github(message),
    desc: 'Shows the github repo',
  },
}

const handleCommands = (
  message: Message,
  command: string,
  args: string[],
): string | null => {
  if (commandActions[command]) {
    commandActions[command].action(message, args)
    return command
  } else {
    message.reply('Invalid command. Usage: !help')
    return null
  }
}

export default handleCommands
