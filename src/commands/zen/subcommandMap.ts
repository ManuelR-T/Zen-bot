import { CommandInteraction } from 'discord.js'

import leaderboard from './leaderboard'
import streak from './streak'

export default new Map<
  string,
  (interaction: CommandInteraction) => Promise<void>
>([
  ['leaderboard', leaderboard],
  ['streak', streak],
])
