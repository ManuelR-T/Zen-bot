import cron from 'node-cron'

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
  cron.schedule('0 2 * * *', async () => await resetFields({ countDay: 0 }))
  // 2am every Monday
  cron.schedule('0 2 * * 1', async () => await resetFields({ countWeek: 0 }))
}
