import { Message } from 'discord.js'
import { TOKEN, PREFIX } from './config'
import { initializeBot, client } from './init'
import handleCommands from './commands/index'
import handleMessages from './messages'

const splitCommand = (message: string): { command: string; args: string[] } => {
  const args = message.slice(PREFIX.length).split(' ')
  const command = args.shift()?.toLowerCase() || ''
  return { command, args }
}

const handleMessagesCommands = async (message: Message): Promise<void> => {
  if (message.author.bot) return

  if (message.content.startsWith(PREFIX)) {
    const { command, args } = splitCommand(message.content)
    handleCommands(message, command, args)
  } else {
    handleMessages(message)
  }
}
client.on('ready', () => initializeBot(handleMessagesCommands))
client.login(TOKEN)
