import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getLeaderboard = async (
  time: string,
  userNb: number,
): Promise<Array<{ name: string; value: string }>> => {
  let sortfield: keyof Prisma.UserCreateInput = 'count'
  if (time === 'weekly') {
    sortfield = 'countWeek'
  } else if (time === 'daily') {
    sortfield = 'countDay'
  }

  const results = await prisma.user.findMany({
    where: {
      [sortfield]: {
        gt: 0,
      },
    },
    orderBy: {
      [sortfield]: 'desc',
    },
    take: userNb,
  })

  return results.map((result, index) => {
    const rankIcon =
      index < 3 ? ['🥇', '🥈', '🥉'][index] : (index + 1).toString() + '.   '
    const count = result[sortfield]
    return {
      name: `${rankIcon}          ${count} ${count === 1 ? 'time' : 'times'}`,
      value: `<@${result.id}> `,
      inline: true,
    }
  })
}
