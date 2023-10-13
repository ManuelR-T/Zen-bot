import axios from 'axios'
import {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteraction,
} from 'discord.js'

import { Command } from '@/types'
import { pluralize } from '@/utils'

type RepoData = {
  name: string
  desc: string | null
  url: string
  created_at: string
  last_update: string
  stars: number
  watchers: number
  issues: number
}

async function getRepoData(owner: string, repo: string): Promise<RepoData> {
  try {
    const data = (
      await axios.get(`https://api.github.com/repos/${owner}/${repo}`)
    ).data

    const values = {
      name: data.name,
      desc: data.description,
      url: data.html_url,
      created_at: data.created_at,
      last_update: data.updated_at,
      stars: data.stargazers_count,
      watchers: data.watchers_count,
      issues: data.open_issues_count,
    }

    return values
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch repository star count')
  }
}

const data = new SlashCommandBuilder()
  .setName('github')
  .setDescription('Shows the github repo')

const execute = async (interaction: CommandInteraction): Promise<void> => {
  const repoData = await getRepoData('ManuelR-T', 'Zen-bot')
  const embed = new EmbedBuilder()
    .setColor('#24292e')
    .setTitle(`📚 __**${repoData.name}**__`)
    .setDescription(
      `
      ${repoData.desc}

      **${pluralize('Star', repoData.stars > 1)},: ${repoData.stars}** ⭐
       | **${pluralize('Watcher', repoData.watchers > 1)}: ${
         repoData.watchers
       }** 👀
       | **${pluralize('Issue', repoData.issues > 1)}: ${repoData.issues}** 🐞

    `,
    )
    .setURL(`${repoData.url}`)
    .setAuthor({
      name: 'GitHub Repo Info',
      iconURL:
        'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    })
    .setFooter({
      text: `Last update: ${new Date(repoData.last_update).toDateString()}`, // Display the date of the last update in the footer
      iconURL:
        'https://t3.ftcdn.net/jpg/04/30/88/00/360_F_430880079_xhvaasQ8uUeP7PyYLDY8jwZvQ3mekZFY.jpg',
    })
    .setTimestamp(new Date(repoData.last_update))

  await interaction.reply({ embeds: [embed] })
}

export default { data, execute } as Command
