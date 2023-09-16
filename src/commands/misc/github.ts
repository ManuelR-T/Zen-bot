import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders'

import { Command, CommandExecute } from '../../type'

const data = new SlashCommandBuilder()
    .setName('github')
    .setDescription('Shows the github repo')

const execute: CommandExecute = async (interaction) => {
  const embed = new EmbedBuilder()
    .setColor(0x3498db)
    .setTitle('Discord Nose Bot on GitHub')
    .setDescription('Click the link above to visit the repository!')
    .setURL('https://github.com/ManuelR-T/Discord-nose-bot')
    .setThumbnail(
      'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    )
    .setFooter({
      text: 'Discord Nose Bot',
    })

  await interaction.reply({ embeds: [embed] })
}

export default { data, execute } as Command

