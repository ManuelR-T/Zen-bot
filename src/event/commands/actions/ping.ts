import { Message } from 'discord.js'

export const ping = (message: Message): void => {
  message.reply(
    `Pong! This message had a latency of ${
      Date.now() - message.createdTimestamp
    }ms.`,
  )
}
