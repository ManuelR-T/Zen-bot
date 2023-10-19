import { UpdateQuery } from 'mongoose'

import { TUser, userModel } from '@/schemas/userSchema'
import logger from '@/utils/logger'

const updateZenCount = async (
  userId: string,
  updates: UpdateQuery<Partial<TUser>>,
): Promise<void> => {
  try {
    await userModel.findOneAndUpdate({ _id: userId }, updates, {
      upsert: true,
      new: true,
    })
  } catch (error) {
    logger.error(error)
    throw new Error('Database operation failed')
  }
}

export const incZenCount = async (
  id: string,
  currentDate: Date = new Date(),
  isStreak: boolean,
  streak: number = 0,
  inc: number = 1,
): Promise<void> => {
  const queryUpdate = isStreak
    ? {
        $inc: { streak: inc, count: inc, countWeek: inc, countDay: inc },
        $max: { bestStreak: (streak || 0) + inc },
        lastMessageTime: currentDate,
      }
    : {
        $max: { bestStreak: inc },
        $set: { streak: inc },
        $inc: { count: inc, countWeek: inc, countDay: inc },
        lastMessageTime: currentDate,
      }

  await updateZenCount(id, queryUpdate)
}
