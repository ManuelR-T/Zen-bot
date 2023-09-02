import { Message } from 'discord.js'
import { TOKEN, PREFIX, NOSE } from './config'
import { handleCommands } from './commands/index'
import { initializeBot, client } from './init'
import zenCountSchema from './schemas/zenCountSchema'

const isMirrorTime = (): boolean => {
  const now = new Date()
  const gmt = now.getTimezoneOffset() / 60
  return now.getHours() === now.getMinutes() + 2 - gmt
}

const handleNezMessage = async (message: Message): Promise<void> => {
  if (!isMirrorTime()) return

  const content = message.content.toLowerCase()

  if (!NOSE.some(keyword => content.includes(keyword))) return

  try {
    const userDoc = await zenCountSchema
      .findOne({ _id: message.author.id })
      .exec()
    const lastMessageTime: Date = userDoc?.lastMessageTime || new Date(0)

    if (new Date().getTime() - lastMessageTime.getTime() < 1000 * 60) {
      console.log('actual time: ' + new Date())
      console.log('last message time: ' + lastMessageTime)
      console.warn('❌ ' + 'Two nose message in less than 60 sec')
      return
    }

    await zenCountSchema.findOneAndUpdate(
      { _id: message.author.id },
      { $inc: { count: 1 }, lastMessageTime: new Date() },
      { upsert: true, new: true },
    )
  } catch (error) {
    console.error('❌ ' + 'Error handling Nez message:', error)
  }
  message.react('👃')
}

const splitCommand = (message: string): { command: string; args: string[] } => {
  const args = message.slice(PREFIX.length).split(' ')
  const command = args.shift()?.toLowerCase() || ''
  return { command, args }
}

const handleMessages = async (message: Message): Promise<void> => {
  if (message.author.bot) return

  if (message.content.startsWith(PREFIX)) {
    const { command, args } = splitCommand(message.content)
    handleCommands(message, command, args)
  } else {
    handleNezMessage(message)
  }
}

client.on('ready', () => initializeBot(handleMessages))
client.login(TOKEN)
