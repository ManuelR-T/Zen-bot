import { Message, EmbedBuilder } from 'discord.js'

export const github = (message: Message): void => {
  const embed = new EmbedBuilder()
    .setColor(0x3498db)
    .setTitle('Discord Nose Bot on GitHub')
    .setDescription('Click the link above to visit the repository!')
    .setURL('https://github.com/ManuelR-T/Discord-nose-bot')
    .setThumbnail(
      'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    )
    .setFooter({
      text: 'Discord Nose Bot',
      iconURL: message.author.displayAvatarURL(),
    })

  message.channel.send({ embeds: [embed] })
}