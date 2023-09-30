import cron from 'node-cron'

import wordleManager from './games/wordle'
import zenCountSchema from './schemas/zenCountSchema'

async function resetFields(
  fieldsToUpdate: Record<string, string | number | Date>,
): Promise<void> {
  try {
    await zenCountSchema.updateMany({}, { $set: fieldsToUpdate })
    console.log('Fields have been reset')
  } catch (error) {
    console.error('Error resetting fields:', error)
  }
}

export default (): void => {
  // 2am every day
  cron.schedule('0 2 * * *', () => wordleManager.resetAllGames())
  cron.schedule('0 2 * * *', async () => resetFields({ countDay: 0 }))
  // 2am every Monday
  cron.schedule('0 2 * * 1', async () => resetFields({ countWeek: 0 }))
}
