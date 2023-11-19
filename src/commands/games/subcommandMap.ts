import { CommandInteraction } from 'discord.js'

import rps from './rps'

export default new Map<
  string,
  (interaction: CommandInteraction) => Promise<void>
>([
    ['rps', rps]
])
