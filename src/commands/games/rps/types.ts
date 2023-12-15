import { CommandInteraction, Message, User } from 'discord.js'

import { Nullable } from '@/types'

export type Choice = 'rock' | 'paper' | 'scissors'
export type RpsEmoji = '🪨' | '📜' | '✂️' | '❓'
export type RpsResult = 'tie' | 'player1' | 'player2'

export type CommonProps = {
  p2: Nullable<User>
}

export type FirstProps = CommonProps & {
  type: 'First'
  interaction: CommandInteraction
}

export type RetryProps = CommonProps & {
  type: 'Retry'
  message: Message
  p1: User
}

export type sendRpsProps = FirstProps | RetryProps

export function isFirstProps(props: sendRpsProps): props is FirstProps {
  return props.type === 'First'
}
