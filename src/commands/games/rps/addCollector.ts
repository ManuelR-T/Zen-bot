import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  Message,
  User,
} from 'discord.js'

type Choice = 'rock' | 'paper' | 'scissors'

function isChoice(choice: string): choice is Choice {
  return ['rock', 'paper', 'scissors'].includes(choice)
}

const rpsResolver = (
  player1Choice: Choice,
  player2Choice: Choice,
): 'tie' | 'player1' | 'player2' => {
  if (player1Choice === player2Choice) return 'tie'

  const winsAgainst = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
  }

  return winsAgainst[player1Choice] === player2Choice ? 'player1' : 'player2'
}

export default async (
  message: Message,
  row: ActionRowBuilder<ButtonBuilder>,
  embed: EmbedBuilder,
  player1: User,
  player2: User | null,
): Promise<void> => {
  const collector = message.createMessageComponentCollector({ time: 60000 })
  let player1Choice: Choice | null = null
  let player2Choice: Choice | null = null

  collector.on('collect', async (i) => {
    if (i.user.bot || !isChoice(i.customId)) return

    if (i.user.id === player1.id) {
      player1Choice = i.customId
      if (!player2) {
        const choices: Choice[] = ['rock', 'paper', 'scissors']
        player2Choice = choices[Math.floor(Math.random() * choices.length)]
      }
    } else if (player2 && i.user.id === player2.id) {
      player2Choice = i.customId
    } else {
      return
    }

    if (player1Choice && player2Choice) {
      await i.deferUpdate()
      collector.stop()
    }
  })

  collector.on('end', async () => {
    row.components.forEach((component) => component.setDisabled(true))

    player2 = player2 ?? message.client.user

    const emojiMap = {
      rock: '🪨',
      paper: '📜',
      scissors: '✂️',
    }

    const player1Emoji = player1Choice ? emojiMap[player1Choice] : '❓'
    const player2Emoji = player2Choice ? emojiMap[player2Choice] : '❓'

    let description = `⏳ Time has warped the battlefield...\n${player1} conjured ${player1Emoji}, \nwhile ${player2} conjured ${player2Emoji}.\n\n🌀 The cosmos have declared a timeout! 🌀`

    if (player1Choice && player2Choice) {
      const result = rpsResolver(player1Choice, player2Choice)

      const winnerAnnouncement =
        result === 'tie'
          ? "It's an epic stalemate! 🌟"
          : `🎉 Victory for ${result === 'player1' ? player1 : player2}! 🎉`

      description = `🚀 The battle commences! 🚀\n\n${player1} summons ${player1Emoji} \nagainst ${player2}'s ${player2Emoji}!\n\n🌌 ${winnerAnnouncement}`
    }

    await message.edit({
      embeds: [embed.setDescription(description)],
      components: [row],
    })
  })
}
