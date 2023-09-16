import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from "discord.js";

import { Command, CommandExecute } from "../../type";

const data = new SlashCommandBuilder()
  .setName("wordle")
  .setDescription("Play your daily wordle game!")
  .addSubcommand((subcommand) =>
    subcommand.setName("start").setDescription("Start a new game")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("guess")
      .setDescription("Guess a word")
      .addStringOption((option) =>
        option
          .setName("word")
          .setDescription("The word to guess")
          .setRequired(true)
      )
  );

const execute : CommandExecute = async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;

  const subcommand = (
    interaction.options as CommandInteractionOptionResolver
  ).getSubcommand();

  switch (subcommand) {
    case "guess":
      await handleGuess(interaction);
      break;
    case "start":
      await handleStart(interaction);
      break;
    default:
      await interaction.reply({
        content: "Unknown subcommand",
        ephemeral: true,
      });
  }
};

const handleStart = async (interaction: CommandInteraction) => {
  await interaction.reply("start");
};

const handleGuess = async (interaction: CommandInteraction) => {
  await interaction.reply("guess");
};

export default { data, execute } as Command;
