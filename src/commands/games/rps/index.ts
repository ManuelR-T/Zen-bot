import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
} from 'discord.js'
import { logger } from 'utils'

import addCollector from './addCollector'

const execute = async (interaction: CommandInteraction): Promise<void> => {
  try {
    let user = interaction.options.getUser('user')

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

    const embed = new EmbedBuilder()
      .setTitle('Rock Paper Scissors')
      .setDescription(
        `${interaction.user} vs ${user ?? interaction.client.user} \n
            Choose your weapon! \nThe game will end <t:${
              Math.floor(interaction.createdTimestamp / 1000) + 60
            }:R>`,
      )
      .setTimestamp()
      .setColor(0x0099ff)

    const message = await interaction.followUp({
      embeds: [embed],
      components: [row],
    })

    await addCollector(message, row, embed, interaction.user, user)
  } catch (error) {
    logger.error('Error rps command:', error)
  }
}

export default execute
