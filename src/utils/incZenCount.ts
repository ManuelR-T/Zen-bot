import { UpdateQuery } from 'mongoose'
import zenCountSchema, { IZenCount } from 'schemas/zenCountSchema'

const updateZenCount = async (
  userId: string,
  updates: UpdateQuery<Partial<IZenCount>>,
): Promise<void> => {
  try {
    await zenCountSchema.findOneAndUpdate({ _id: userId }, updates, {
      upsert: true,
      new: true,
    })
  } catch (error) {
    console.error(error)
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
