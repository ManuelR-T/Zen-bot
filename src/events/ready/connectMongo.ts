import { connect } from 'mongoose'

import { MONGO_URI } from '@/config'

const connectMongo = async (): Promise<void> => {
  console.info('Connecting to the Database')
  try {
    await connect(MONGO_URI)
  } catch (err) {
    console.error('Failed to connect to MongoDB.', err)
    process.exit(1)
  }
  console.log('Connected to the Database')
}

export default connectMongo
