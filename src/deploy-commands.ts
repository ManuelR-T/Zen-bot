import { fileURLToPath } from 'bun'
import { REST } from 'discord.js'
import { Routes } from 'discord-api-types/v10'
import { readdirSync } from 'fs'
import path, { join } from 'path'
import { logger } from 'utils'

import Config from '@/config'

import { Command } from './types'

const commands: Command[] = []
const dirName = path.dirname(fileURLToPath(new URL(import.meta.url)))
const foldersPath = join(dirName, 'commands')
const commandFolders = readdirSync(foldersPath)

async function loadCommands(): Promise<void> {
  for (const folder of commandFolders) {
    const commandsPath = join(foldersPath, folder)
    const commandFiles = readdirSync(commandsPath).filter(
      (file) => file === 'index.ts',
    )

    for (const file of commandFiles) {
      const filePath = join(commandsPath, file)
      try {
        const importCommand = await import(filePath)
        const command = importCommand.default

        if ('data' in command && 'execute' in command) {
          logger.info(`Loading ${command.data.name} command ...`)
          commands.push(command.data.toJSON())
        } else {
          logger.warn(
            `The command at ${filePath} is missing a required "data" or "execute" property.`,
          )
        }
      } catch (error) {
        logger.error(`Failed to load command at ${filePath}:`, error)
      }
    }
  }
}

const sendCommandRequest = async (): Promise<unknown[]> => {
  const rest = new REST().setToken(Config.TOKEN)
  const response = await rest.put(
    Routes.applicationCommands(Config.CLIENT_ID),
    {
      body: commands,
    },
  )
  return response as Array<unknown>
}

const refreshApplicationCommands = async (): Promise<void> => {
  try {
    await loadCommands()

    logger.info(
      `Started refreshing ${commands.length} application (/) commands.`,
    )

    const data = await sendCommandRequest()

    logger.info(
      `Successfully reloaded ${data.length} application (/) commands.`,
    )
  } catch (error) {
    logger.error(error)
  }
}

await refreshApplicationCommands()
