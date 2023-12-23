import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from 'discord.js'

import { Nullable } from '@/types'
import { MyClient } from '@/types'

import { sendRps } from '.'
import { RpsPlayer, RpsPlayerReady } from './rpsPlayer'
import { Choice } from './types'

function isChoice(choice: Nullable<string>): choice is Choice {
  if (!choice) return false
  return ['rock', 'paper', 'scissors'].includes(choice)
}

export default async (
  message: Message,
  row: ActionRowBuilder<ButtonBuilder>,
  embed: EmbedBuilder,
  p1: RpsPlayer,
  p2: RpsPlayer,
  client: MyClient,
): Promise<void> => {
  const collector = message.createMessageComponentCollector({ time: 60000 })
  const rowRetry = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('rps:retry')
      .setLabel(`Retry${p2.user.bot === false ? ' (0/2)' : ''}`)
      .setEmoji('🔄')
      .setStyle(ButtonStyle.Secondary),
  )

  collector.on('collect', async (i) => {
    if (i.user.bot || !isChoice(i.customId)) return

    if (i.user === p1.user) {
      p1.choice = i.customId
    } else if (p2.user && i.user === p2.user) {
      p2.choice = i.customId
    } else {
      return
    }

    await i.deferUpdate()
    if (p1.choice && p2.choice) collector.stop()
  })

  collector.on('end', async () => {
    const collectorRetry = message.createMessageComponentCollector({
      time: 60000,
    })

    collectorRetry.on('collect', async (i) => {
      if (i.user.bot || i.customId !== 'rps:retry') return

      if (i.user === p1.user) {
        if (!p1.retry) {
          p1.retry = true
          rowRetry.components[0].setLabel('Retry (1/2)')
        } else {
          await i.deferUpdate()
          return
        }
      } else if (p2 && i.user === p2.user) {
        if (!p2.retry) {
          p2.retry = true
          rowRetry.components[0].setLabel('Retry (1/2)')
        } else {
          await i.deferUpdate()
          return
        }
      } else {
        await i.followUp({
          content: 'You cannot retry for someone else!',
          ephemeral: true,
        })
        return
      }
      await message.edit({
        components: [row, rowRetry],
      })
      if (p1.retry && (p2.retry || p2.user?.bot)) collectorRetry.stop()
    })

    collectorRetry.on('end', async () => {
      rowRetry.components.forEach((component) => component.setDisabled(true))
      if (p1.retry && (p2.retry || p2.user?.bot))
        sendRps({ type: 'Retry', p2, message, p1 }, client)
    })

    row.components.forEach((component) => component.setDisabled(true))

    p1.refreshEmoji()
    p2.refreshEmoji()
    if (p1.isReady() && p2.isReady()) {
      await message.edit({
        embeds: [embed.setDescription(getEndGameDesc(p1, p2))],
        components: [row, rowRetry],
      })
    } else {
      const desc = `⏳ Time has warped the battlefield...\n${p1.user} conjured ${p1.emoji}, \nwhile ${p2.user} conjured ${p2.emoji}.\n\n🌀 The cosmos has declared a timeout! 🌀`
      await message.edit({
        embeds: [embed.setDescription(desc)],
        components: [row, rowRetry],
      })
    }
  })
}

const getEndGameDesc = (p1: RpsPlayerReady, p2: RpsPlayerReady): string => {
  const result = p1.rpsResolver(p2)

  const scoreAnnouncement = `The score is now ${p1.score} - ${p2.score}!`

  const winnerAnnouncement =
    result === 'tie'
      ? "It's an epic stalemate! 🌟"
      : `🎉 Victory for ${result === 'player1' ? p1.user : p2.user}! 🎉`

  return `🚀 The battle commences! 🚀\n\n${p1.user} summons ${p1.emoji} \nagainst ${p2.user}'s ${p2.emoji}!\n\n🌌 ${winnerAnnouncement}\n ${scoreAnnouncement}`
}
