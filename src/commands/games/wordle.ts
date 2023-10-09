import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  SlashCommandBuilder,
} from 'discord.js'
import wordleManager from 'src/games/wordle'
import { getRandomWord } from 'src/games/wordle/words'
import { Command } from 'src/types'
import { stringToEmoji } from 'src/utils'

const data = new SlashCommandBuilder()
  .setName('wordle')
  .setDescription('Play your daily wordle game!')
  .addSubcommand((subcommand) =>
    subcommand.setName('start').setDescription('Start a new game (alpha)'),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('guess')
      .setDescription('Guess a word (alpha)')
      .addStringOption((option) =>
        option
          .setName('word')
          .setDescription('The word to guess (alpha)')
          .setRequired(true),
      ),
  )

const execute = async (interaction: CommandInteraction): Promise<void> => {
  if (!interaction.isCommand()) return
  CommandInteraction
  const subcommand = (
    interaction.options as CommandInteractionOptionResolver
  ).getSubcommand()

  switch (subcommand) {
    case 'guess':
      await handleGuess(interaction)
      break
    case 'start':
      await handleStart(interaction)
      break
    default:
      await interaction.reply({
        content: 'Unknown subcommand',
        ephemeral: true,
      })
  }
}

//TODO: Make reply fancier
const handleStart = async (interaction: CommandInteraction): Promise<void> => {
  const word = getRandomWord()

  console.log(word)
  if (!word) {
    await interaction.reply({ content: 'No word found', ephemeral: true })
    return
  }
  if (wordleManager.hasGame(interaction.user.id)) {
    await interaction.reply({
      content: 'You already have a game in progress',
      ephemeral: true,
    })
    return
  }
  wordleManager.createGame(interaction.user.id, word)

  let response: string = ''
  response += word[0]
  for (let i = 1; i < word.length; i++) {
    response += ' 🟦'
  }

  await interaction.reply({
    content: `Game created
  ${response.toUpperCase()}`,
    ephemeral: true,
  })
}

const handleGuess = async (interaction: CommandInteraction): Promise<void> => {
  const word = interaction.options.get('word')?.value
  const player = interaction.user.id

  if (!word || typeof word !== 'string') {
    await interaction.reply({ content: 'No word found', ephemeral: true })
    return
  }

  if (!wordleManager.hasGame(player)) {
    await interaction.reply({
      content: 'You do not have a game in progress',
      ephemeral: true,
    })
    return
  }
  try {
    const wordle = await wordleManager.guess(player, word)
    const statusDisplay = wordleManager.getStatusDisplay(player)
    if (!statusDisplay) {
      await interaction.reply({
        content: 'No status display found',
        ephemeral: true,
      })
      return
    }

    const remainingGuesses = wordleManager.getRemainingGuesses(player)

    await interaction.reply({
      content: `Guess: ${stringToEmoji(
        word,
      )}\nFeedback: ${wordle}\n\nCurrent Status: ${stringToEmoji(
        statusDisplay,
      )}\nGuesses remaining: ${remainingGuesses}`,
      ephemeral: true,
    })
  } catch (error) {
    await interaction.reply({
      content: `An unexpected error occurred.`,
      ephemeral: true,
    })
    return
  }
}

export default { data, execute } as Command
