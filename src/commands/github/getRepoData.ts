import axios from 'axios'
import { logger } from 'utils'

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

export async function getRepoData(
  owner: string,
  repo: string,
): Promise<RepoData> {
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
    logger.error(error)
    throw new Error('Failed to fetch repository star count')
  }
}
