import { User } from 'discord.js'

import { MyClient, Nullable } from '@/types'

import { Choice, RpsEmoji, RpsResult } from './types'

export class RpsPlayer {
  public user: User
  public choice: Nullable<Choice> = null
  public emoji?: RpsEmoji
  public retry = false
  public score = 0
  private readonly emojiMap = new Map<Choice, RpsEmoji>([
    ['rock', '🪨'],
    ['paper', '📜'],
    ['scissors', '✂️'],
  ])
  private readonly choices = ['rock', 'paper', 'scissors'] as const
  private readonly gameOutcomeMatrix: RpsResult[][] = [
    ['tie', 'player2', 'player1'],
    ['player1', 'tie', 'player2'],
    ['player2', 'player1', 'tie'],
  ]

  public refreshEmoji(): void {
    if (this.choice) this.emoji = this.emojiMap.get(this.choice)
    else this.emoji = '❓'
  }

  public isReady(): this is RpsPlayerReady {
    return this.user !== null && this.choice !== null && this.emoji !== '❓'
  }

  private setRandomChoice(): void {
    const choices: Choice[] = ['rock', 'paper', 'scissors']
    this.choice = choices[Math.floor(Math.random() * choices.length)]
  }

  public rpsResolver(other: RpsPlayer): RpsResult {
    if (!this.isReady() || !other.isReady())
      throw new Error('Both players must be ready to resolve the game.')

    const outcome =
      this.gameOutcomeMatrix[this.choices.indexOf(this.choice)][
        this.choices.indexOf(other.choice)
      ]
    if (outcome === 'player1') this.score++
    else if (outcome === 'player2') other.score++

    return outcome
  }

  constructor(
    user: Nullable<User>,
    choice: Nullable<Choice>,
    client?: MyClient,
  ) {
    if (user === null) {
      if (!client) throw new Error('Client must be provided if user is null.')
      this.user = client.user as User
      this.setRandomChoice()
    } else {
      this.user = user
      this.choice = choice
    }
    this.refreshEmoji()
  }
}

export class RpsPlayerReady extends RpsPlayer {
  public user: User
  public choice: Choice

  constructor(user: User, choice: Choice) {
    super(user, choice, undefined)
    this.user = user
    this.choice = choice
  }
}
