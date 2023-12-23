import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
} from 'discord.js'

import { MyClient } from '@/types'

import addCollector from './addCollector'
import { RpsPlayer } from './rpsPlayer'
import { isFirstProps, sendRpsProps } from './types'

const execute = async (interaction: CommandInteraction): Promise<void> => {
  let user = interaction.options.getUser('user')
  const client = interaction.client as MyClient

  if (user === interaction.user) {
    await interaction.reply({
      content: "You can't play against yourself!",
      ephemeral: true,
    })
    return
  }
  if (user === interaction.client.user) {
    user = null
  }
  if (user?.bot) {
    await interaction.reply({
      content: "You can't play against another bot than me!",
      ephemeral: true,
    })
    return
  }
  await interaction.deferReply({ ephemeral: false })
  await sendRps({ type: 'First', p2: user, interaction }, client)
}

export const sendRps = async (
  props: sendRpsProps,
  client: MyClient,
): Promise<void> => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`rock`)
      .setLabel('Rock')
      .setEmoji('🪨')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`paper`)
      .setLabel('Paper')
      .setEmoji('📄')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`scissors`)
      .setLabel('Scissors')
      .setEmoji('✂️')
      .setStyle(ButtonStyle.Primary),
  )

  if (isFirstProps(props)) {
    const p1 = new RpsPlayer(props.interaction.user, null, client)
    const p2 = new RpsPlayer(props.p2, null, client)
    const embed = new EmbedBuilder()
      .setTitle('Rock Paper Scissors')
      .setDescription(
        `${props.interaction.user} vs ${
          props.p2 ?? props.interaction.client.user
        } \n
            Choose your weapon! \nThe game will end <t:${
              Math.floor(props.interaction.createdTimestamp / 1000) + 60
            }:R>`,
      )
      .setTimestamp()
      .setColor(0x0099ff)

    const message = await props.interaction.followUp({
      embeds: [embed],
      components: [row],
    })
    await addCollector(message, row, embed, p1, p2, client)
  } else {
    const embed = new EmbedBuilder()
      .setTitle('Rock Paper Scissors')
      .setDescription(
        `${props.p1.user} vs ${props.p2.user ?? client.user} \n
            Choose your weapon! \nThe game will end <t:${
              Math.floor(new Date().valueOf() / 1000) + 60
            }:R>`,
      )
      .setTimestamp()
      .setColor(0x0099ff)

    const message = await props.message.edit({
      embeds: [embed],
      components: [row],
    })
    await addCollector(message, row, embed, props.p1, props.p2, client)
  }
}

export default execute
