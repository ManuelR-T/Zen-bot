import {
  MessageReaction,
  User,
  PartialMessageReaction,
  PartialUser,
} from 'discord.js'

const handleReaction = async (
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
): Promise<void> => {
  if (user === null || user.partial || reaction === null || reaction.partial)
    return
  //reaction.message.channel.send('<@' + user.id + '> reacted with ' + reaction.emoji.name + ' on ' + reaction.message.content)
  console.log(
    '<@' +
      user.id +
      '> reacted with ' +
      reaction.emoji.name +
      ' on ' +
      reaction.message.content,
  )
}

export default handleReaction
