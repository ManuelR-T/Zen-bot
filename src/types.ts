import {
  Client,
  Collection,
  CommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'

export type Command = {
  data: SlashCommandBuilder
  execute: (interaction: CommandInteraction) => Promise<void>
}

export type Event = {
  name: string
  once?: boolean
  listener: (...args: unknown[]) => Promise<void>
}

export class MyClient extends Client {
  commands = new Collection<string, Command>()
}
