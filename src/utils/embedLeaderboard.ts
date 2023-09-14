import { EmbedBuilder, RGBTuple } from 'discord.js'

type embedLeaderboardProps = {
  title: string
  leaderboardEntries: Array<{ name: string; value: string }>
  time?: string
  defaultTime?: string
  userNb?: number
  defaultUserNb?: number
  color?: number | RGBTuple
  url?: string
}

export const newEmbedLeaderboard = (props: embedLeaderboardProps) => {
  return new EmbedBuilder()
    .setColor(props.color || 0x0099ff)
    .setURL(props.url || null)
    .setTitle(
      props.title +
        (props.userNb === undefined
          ? ''
          : props.userNb === props.defaultUserNb
          ? ''
          : ` TOP ${props.userNb}`) +
        (props.time === undefined
          ? ''
          : props.time === props.defaultTime
          ? ''
          : ` (${props.time})`),
    )
    .addFields(...props.leaderboardEntries)
    .setFooter({
      text: 'Last updated',
      iconURL:
        'https://t3.ftcdn.net/jpg/04/30/88/00/360_F_430880079_xhvaasQ8uUeP7PyYLDY8jwZvQ3mekZFY.jpg',
    })
    .setTimestamp()
}
