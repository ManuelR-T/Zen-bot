import { Message, EmbedBuilder } from 'discord.js'
import { commandActions } from '../index'

export const help = (message: Message): void => {
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('Available Commands')
    .addFields(
      Object.keys(commandActions).map(cmd => ({
        name: '!' + cmd,
        value: commandActions[cmd].desc,
      })),
    )
    .setFooter({
      text: 'Use !help to display this message again',
    })
  message.channel.send({ embeds: [embed] })
}

