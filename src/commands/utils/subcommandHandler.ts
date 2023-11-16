import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js'

export default async (
  interaction: CommandInteraction,
  subcommandMap: Map<
    string,
    (interaction: CommandInteraction) => Promise<void>
  >,
): Promise<void> => {
  const subcommandName = interaction.options.data.find(
    (option) => option.type === ApplicationCommandOptionType.Subcommand,
  )?.name

  if (subcommandName) {
    const subcommandFunction = subcommandMap.get(subcommandName)
    if (subcommandFunction) {
      await subcommandFunction(interaction)
    } else {
      interaction.reply(`Subcommand not found: ${subcommandName}`)
    }
  }
}
