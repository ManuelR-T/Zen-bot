import { Schema, model, models } from 'mongoose'

const zenCountSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
    default: 0,
  },
  countDay: {
    type: Number,
    required: true,
    default: 0,
  },
  countWeek: {
    type: Number,
    required: true,
    default: 0,
  },
  lastMessageTime: {
    type: Date,
    required: true,
    default: new Date(0),
  },
  streak: {
    type: Number,
    required: true,
    default: 0,
  },
  bestStreak: {
    type: Number,
    required: true,
    default: 0,
  },
})

const name = 'ZenCountSchema'
export default models[name] || model(name, zenCountSchema)
