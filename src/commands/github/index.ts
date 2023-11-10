import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js'
import { pluralize } from 'utils'

import { Command } from '@/types'

import { getRepoData } from './getRepoData'

const data = new SlashCommandBuilder()
  .setName('github')
  .setDescription('Shows the github repo')

const execute = async (interaction: CommandInteraction): Promise<void> => {
  await interaction.deferReply()

  const repoData = await getRepoData('ManuelR-T', 'Zen-bot')
  const embed = new EmbedBuilder()
    .setColor('#24292e')
    .setTitle(`📚 __**${repoData.name}**__`)
    .setDescription(
      `
      ${repoData.desc}

      **${pluralize('Star', repoData.stars > 1)}: ${
        repoData.stars
      }** ⭐ | **${pluralize('Watcher', repoData.watchers > 1)}: ${
        repoData.watchers
      }** 👀 | **${pluralize('Issue', repoData.issues > 1)}: ${
        repoData.issues
      }** 🐞

    `,
    )
    .setURL(`${repoData.url}`)
    .setAuthor({
      name: 'GitHub Repo Info',
      iconURL:
        'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    })
    .setFooter({
      text: `Last update`,
      iconURL:
        'https://t3.ftcdn.net/jpg/04/30/88/00/360_F_430880079_xhvaasQ8uUeP7PyYLDY8jwZvQ3mekZFY.jpg',
    })
    .setTimestamp(new Date(repoData.last_update))

  await interaction.followUp({ embeds: [embed] })
}

export default { data, execute } as Command
