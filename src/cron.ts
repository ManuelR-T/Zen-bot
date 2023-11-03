import { Prisma, PrismaClient } from '@prisma/client'
import cron from 'node-cron'
import { logger } from 'utils'

const prisma = new PrismaClient()

async function resetFields(
  fieldsToUpdate: Prisma.UserUpdateInput,
): Promise<void> {
  try {
    await prisma.user.updateMany({
      data: fieldsToUpdate,
    })
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
