import { Schema, InferSchemaType, model, models } from 'mongoose'

const userSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  countDay: {
    type: Number,
    default: 0,
  },
  countWeek: {
    type: Number,
    default: 0,
  },
  lastMessageTime: {
    type: Date,
    default: new Date(0),
  },
  streak: {
    type: Number,
    default: 0,
  },
  bestStreak: {
    type: Number,
    default: 0,
  },
})

export type TUser = InferSchemaType<typeof userSchema>
export const userModel = models.User || model('User', userSchema)
