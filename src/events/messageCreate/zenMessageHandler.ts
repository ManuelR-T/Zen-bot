import { PrismaClient } from '@prisma/client'
import { Message, User, ReactionCollector } from 'discord.js'
import { isMirrorTime, incZenCount, logger } from 'utils'

import Config from '@/config'

class ZenMessageHandler {
  private readonly prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  private async isFirstNose(date: Date): Promise<boolean> {
    const oneMinuteAgo = new Date(date.valueOf() - 60 * 1000)
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          lastZen: {
            gte: oneMinuteAgo,
          },
        },
        select: {
          id: true,
        },
      })
      return !user
    } catch (error) {
      logger.error(error)
      throw new Error('Database operation failed')
    }
  }

  private getEmoji(message: Message, date: Date): string | null {
    if (!isMirrorTime(date)) return null

    const isZenMessage = Config.ZEN.keywords.some((keyword) =>
      message.content.toLowerCase().includes(keyword),
    )

    if (isZenMessage) return '👃'

    return (
      Config.ZEN.emojis.find((emoji) => message.content.includes(emoji)) || null
    )
  }

  private async userClaims(
    user: User,
    currentDate: Date,
  ): Promise<{ zen: boolean; streak: number }> {
    const userDb = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        lastZen: true,
        streak: true,
      },
    })
    if (userDb === null) return { zen: true, streak: 0 }

    const lastZen: Date = userDb?.lastZen || new Date(0)
    const timeSinceLastClaim = currentDate.getTime() - lastZen.getTime()

    if (timeSinceLastClaim < 60 * 1000) {
      logger.info(
        `2 zen claims < 60 sec ${user.displayName}`,
        currentDate,
        lastZen,
      )
      return { zen: false, streak: 0 }
    }
    return {
      zen: true,
      streak:
        timeSinceLastClaim < 60 * 60 * 1000 + 2 * 60 * 1000
          ? 0
          : userDb?.streak,
    }
  }

  private timeBeforeEndOfMinute(date: Date): number {
    const endOfMinute = new Date(date)
    endOfMinute.setSeconds(59)
    endOfMinute.setMilliseconds(999)
    return endOfMinute.getTime() - date.getTime()
  }

  public async handleMessage(message: Message): Promise<void> {
    const currentDate = new Date()
    const emoji = this.getEmoji(message, currentDate)

    if (emoji === null) return

    const { zen, streak } = await this.userClaims(message.author, currentDate)
    if (!zen) return

    const firstNose = await this.isFirstNose(currentDate)
    await incZenCount(message.author.id, currentDate, streak === 0)

    if (currentDate.getSeconds() >= 55 && firstNose) {
      await message.react('😈')
      return
    }
    await message.react(emoji)

    const collector: ReactionCollector = message.createReactionCollector({
      filter: (reaction) => {
        if (reaction.emoji.name === null) {
          return false
        }
        return Config.ZEN.emojis.includes(reaction.emoji.name)
      },
      time: this.timeBeforeEndOfMinute(currentDate),
    })

    collector.on('collect', async (_, user) => {
      if (user.bot) return
      const { zen, streak } = await this.userClaims(user, new Date())

      if (zen) {
        await incZenCount(user.id, currentDate, streak === 0)
      }
    })
  }
}

export default ZenMessageHandler
