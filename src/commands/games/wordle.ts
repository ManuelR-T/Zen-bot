import { SlashCommandBuilder } from '@discordjs/builders'
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js'

import wordleManager from '../../games/wordle'
import getRandomWord from '../../games/wordle/getRandomWord'
import { Command, CommandExecute } from '../../type'
import { stringToEmoji } from '../../utils'

const data = new SlashCommandBuilder()
  .setName('wordle')
  .setDescription('Play your daily wordle game!')
  .addSubcommand((subcommand) =>
    subcommand.setName('start').setDescription('Start a new game'),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('guess')
      .setDescription('Guess a word')
      .addStringOption((option) =>
        option
          .setName('word')
          .setDescription('The word to guess')
          .setRequired(true),
      ),
  )

const execute: CommandExecute = async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return

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
const handleStart = async (interaction: CommandInteraction) => {
  const word = await getRandomWord('data/wordle_fr.txt')

  if (!word) {
    await interaction.reply({ content: 'No word found', ephemeral: true })
    return
  }
  if (wordleManager.isThereGame(interaction.user.id)) {
    await interaction.reply({
      content: 'You already have a game in progress',
      ephemeral: true,
    })
    return
  }
  wordleManager.createGame(interaction.user.id, word)

  let wordle: string = ''
  wordle += word[0]
  for (let i = 1; i < word.length; i++) {
    wordle += ' 🟦'
  }

  await interaction.reply({
    content: `Game created
  ${wordle.toUpperCase()}`,
    ephemeral: true,
  })
}

const handleGuess = async (interaction: CommandInteraction) => {
  const word = interaction.options.get("word")?.value;

  if (!word || typeof word !== 'string') {
    await interaction.reply({ content: 'No word found', ephemeral: true })
    return
  }

  if (!wordleManager.isThereGame(interaction.user.id)) {
    await interaction.reply({
      content: 'You do not have a game in progress',
      ephemeral: true,
    })
    return
  }
  try {
    const wordle = await wordleManager.guess(interaction.user.id, word)
    //rajouter un espace avant et apres chaque lettre
    await interaction.reply({
      content: `${stringToEmoji(word)}\n${wordle}`,
      ephemeral: true,
    });
  } catch (error) {
    await interaction.reply({
      content: error,
      ephemeral: true,
    })
    return
  }

}

export default { data, execute } as Command
