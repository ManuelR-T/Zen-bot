import { config } from 'dotenv'

config()

export const TOKEN = process.env.TOKEN || ''
export const MONGO_URI = process.env.MONGO_URI || ''
export const PREFIX = process.env.PREFIX || '!'
export const NOSE = ['nez', 'zen', 'nose', '👃', '👃🏻', '👃🏼', '👃🏽', '👃🏾', '👃🏿', '🐽', '☯', '🐉', '🐲']
