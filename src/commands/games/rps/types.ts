import { CommandInteraction, Message, User } from 'discord.js'

import { Nullable } from '@/types'

import { RpsPlayer } from './rpsPlayer'

export type Choice = 'rock' | 'paper' | 'scissors'
export type RpsEmoji = '🪨' | '📜' | '✂️' | '❓'
export type RpsResult = 'tie' | 'player1' | 'player2'

export type FirstProps = {
  type: 'First'
  interaction: CommandInteraction
  p2: Nullable<User>
}

export type RetryProps = {
  type: 'Retry'
  message: Message
  p1: RpsPlayer
  p2: RpsPlayer
}

export type sendRpsProps = FirstProps | RetryProps

export function isFirstProps(props: sendRpsProps): props is FirstProps {
  return props.type === 'First'
}
