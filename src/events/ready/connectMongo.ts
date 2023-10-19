import { connect } from 'mongoose'

import Config from '@/config'
import logger from '@/utils/logger'

const maxRetries = 5
const initialDelay = 1000

const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

const connectMongo = async (): Promise<void> => {
  logger.info('Connecting to the Database')
  let retries = 0
  let delay = initialDelay

  while (retries < maxRetries) {
    try {
      await connect(Config.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
      logger.info('Connected to the Database')
      return
    } catch (err) {
      logger.error('Failed to connect to MongoDB.', err)
      retries += 1
      logger.info(
        `Retrying in ${
          delay / 1000
        } seconds... (Retry ${retries}/${maxRetries})`,
      )
      await sleep(delay)
      delay *= 2
    }
  }

  logger.error('Max retries reached. Could not connect to MongoDB.')
  process.exit(1)
}

export default connectMongo
