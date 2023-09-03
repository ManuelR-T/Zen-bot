import { Message } from 'discord.js'
import handleNezMessage from './nez'

const handleMessages = async (message: Message): Promise<void> => {
  handleNezMessage(message)
}

export default handleMessages
