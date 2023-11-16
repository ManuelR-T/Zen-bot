import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getLeaderboard = async (
  time: string,
  userNb: number,
): Promise<Array<{ name: string; value: string }>> => {
  let sortField: keyof Prisma.UserCreateInput = 'count'
  if (time === 'weekly') {
    sortField = 'countWeek'
  } else if (time === 'daily') {
    sortField = 'countDay'
  }

  const results = await prisma.user.findMany({
    where: {
      [sortField]: {
        gt: 0,
      },
    },
    orderBy: {
      [sortField]: 'desc',
    },
    take: userNb,
  })

  return results.map((result, index) => {
    const rankIcon =
      index < 3 ? ['🥇', '🥈', '🥉'][index] : (index + 1).toString() + '.   '
    const count = result[sortField]
    return {
      name: `${rankIcon}          ${count} ${count === 1 ? 'time' : 'times'}`,
      value: `<@${result.id}> `,
      inline: true,
    }
  })
}
