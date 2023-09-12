import { readdirSync } from 'fs'
import { join } from 'path'

import { Routes } from 'discord-api-types/v10'
import { REST } from 'discord.js'

import { TOKEN, CLIENT_ID } from './config'
import { Command } from './type'

const commands: Command[] = []
const foldersPath = join(__dirname, 'commands')
const commandFolders = readdirSync(foldersPath)

async function loadCommands() {
  for (const folder of commandFolders) {
    const commandsPath = join(foldersPath, folder)
    const commandFiles = readdirSync(commandsPath).filter((file) =>
      file.endsWith('.ts'),
    )

    for (const file of commandFiles) {
      const filePath = join(commandsPath, file)
      try {
        const importCommand = await import(filePath)
        const command = importCommand.default

        if ('data' in command && 'execute' in command) {
          commands.push(command.data.toJSON())
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
          )
        }
      } catch (error) {
        console.error(`Failed to load command at ${filePath}:`, error)
      }
    }
  }
}

const rest = new REST().setToken(TOKEN)

;(async () => {
  try {
    await loadCommands()

    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    )

    const data = (await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    })) as Array<{ name: string }>

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    )
  } catch (error) {
    console.error(error)
  }
})()
