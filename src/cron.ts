import cron from 'node-cron'

import { userModel, TUser } from './schemas/userSchema'
import logger from './utils/logger'

async function resetFields(fieldsToUpdate: Partial<TUser>): Promise<void> {
  try {
    await userModel.updateMany({}, { $set: fieldsToUpdate })
    logger.info('Fields have been reset')
  } catch (error) {
    logger.error('Error resetting fields:', error)
  }
}

export default (): void => {
  // 2am every day
  cron.schedule('0 2 * * *', async () => await resetFields({ countDay: 0 }))
  // 2am every Monday
  cron.schedule('0 2 * * 1', async () => await resetFields({ countWeek: 0 }))
}
