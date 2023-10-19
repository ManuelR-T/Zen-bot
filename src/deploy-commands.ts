import { readdirSync } from 'fs'
import { join } from 'path'

import { Routes } from 'discord-api-types/v10'
import { REST } from 'discord.js'

import { Command } from './types'
import logger from './utils/logger'

import Config from '@/config'

const commands: Command[] = []
const foldersPath = join(__dirname, 'commands')
const commandFolders = readdirSync(foldersPath)

async function loadCommands(): Promise<void> {
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

const rest = new REST().setToken(Config.TOKEN)

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

const sendCommandRequest = async (): Promise<unknown[]> => {
  const response = await rest.put(
    Routes.applicationCommands(Config.CLIENT_ID),
    {
      body: commands,
    },
  )
  return response as Array<unknown>
}

refreshApplicationCommands()
