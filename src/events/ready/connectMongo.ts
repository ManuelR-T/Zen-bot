import { connect } from 'mongoose'

import { MONGO_URI } from '@/config'

const MAX_RETRIES = 5
const INITIAL_DELAY = 1000

const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

const connectMongo = async (): Promise<void> => {
  console.info('Connecting to the Database')
  let retries = 0
  let delay = INITIAL_DELAY

  while (retries < MAX_RETRIES) {
    try {
      await connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
      console.log('Connected to the Database')
      return
    } catch (err) {
      console.error('Failed to connect to MongoDB.', err)
      retries += 1
      console.info(
        `Retrying in ${
          delay / 1000
        } seconds... (Retry ${retries}/${MAX_RETRIES})`,
      )
      await sleep(delay)
      delay *= 2
    }
  }

  console.error('Max retries reached. Could not connect to MongoDB.')
  process.exit(1)
}

export default connectMongo
