import { SlashCommandBuilder } from "@discordjs/builders";

import { Command } from "../../type";

export default {
  data: new SlashCommandBuilder()
    .setName("wordle")
    .setDescription("Play your daily wordle game!"),
  async execute(interaction) {
    await interaction.reply({
      content: `Not implemented yet!`,
      ephemeral: true,
    });
  },
} as Command;
