import { Schema, model, models, Document } from 'mongoose'

export type IZenCount = {
  _id: string
  count: number
  countDay: number
  countWeek: number
  lastMessageTime: Date
  streak: number
  bestStreak: number
}

type ZenCount = IZenCount & Document

const zenCountSchema = new Schema({
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

const name = 'ZenCountSchema'
export default models[name] || model<ZenCount>(name, zenCountSchema)
