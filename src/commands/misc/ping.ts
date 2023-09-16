import { SlashCommandBuilder } from '@discordjs/builders'

import { Command, CommandExecute } from '../../type'


const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!')

const execute : CommandExecute = async (interaction) => {
  await interaction.reply({
    content: `Pong! This message had a latency of ${
      Date.now() - interaction.createdTimestamp
    }ms.`,
    ephemeral: true,
  })
}

export default { data, execute } as Command