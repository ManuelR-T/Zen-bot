import { CacheType, ChatInputCommandInteraction, Collection } from 'discord.js'

import { Command } from '@/types'

const DEFAULT_COOLDOWN_DURATION = 1000

export const handleCooldown = (
  command: Command,
  interaction: ChatInputCommandInteraction<CacheType>,
  cooldowns: Collection<string, Collection<string, number>>,
): boolean => {
  const now = Date.now()
  let timestamps = cooldowns.get(command.data.name)

  if (!timestamps) {
    timestamps = new Collection<string, number>()
    cooldowns.set(command.data.name, timestamps)
  }

  const cooldownAmount = command.cooldown ?? DEFAULT_COOLDOWN_DURATION

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id)! + cooldownAmount
    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000)
      interaction.reply({
        content: `Please wait, you are on a cooldown for \`/${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
        ephemeral: true,
      })
      return true
    }
  }

  timestamps.set(interaction.user.id, now)
  setTimeout(
    () => cooldowns.get(command.data.name)?.delete(interaction.user.id),
    cooldownAmount,
  )

  return false
}
