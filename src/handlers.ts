import fs from 'fs'
import path from 'path'

import { MyClient } from './type'

export const handleEvents = async (client: MyClient): Promise<void> => {
  const eventsPath = path.join(__dirname, 'events')
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js') || file.endsWith('.ts'))

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file)
    const { default: event } = await import(filePath)

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args))
    } else {
      client.on(event.name, (...args) => event.execute(...args))
    }
  }
}

export const handleCommands = async (client: MyClient): Promise<void> => {
  const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'))
  const foldersPath = path.join(__dirname, 'commands')
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js') || file.endsWith('.ts'))
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file)
      try {
        const { default: command } = await import(filePath)
        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command)
        } else {
          console.warn(
            `The command at ${filePath} is missing a required "data" or "execute" property.`,
          )
        }
      } catch (error) {
        console.error(`Failed to load command at ${filePath}:`, error)
      }
    }
  }
}
