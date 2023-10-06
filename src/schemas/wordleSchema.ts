import { Schema, model, models } from 'mongoose'

const wordleSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  lastTime: {
    type: Date,
    default: new Date(0),
  },
  streak: {
    type: Number,
    default: 0,
  },
})

const name = 'WordleSchema'
export default models[name] || model(name, wordleSchema)
