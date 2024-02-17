const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')
const config = require('../config');

module.exports = {
    name: "ticketsLogs",
    once: false,
    async execute(type, int, client) {
        const { guild, user, channelId, customId } = int
        const Logchannel = client.channels.cache.get(config.Channels.Log), Save = client.channels.cache.get(config.Channels.LogSave)
        const logEmbed = new EmbedBuilder()

        switch (type) {
            case 'Banned': {
                logEmbed.setColor('Blurple')
                    .setTitle('📬️ | تیکت جدیدی از یک فرد بن شده ایجاد شد')
                    .setDescription('اطلاعات :\n\nکاربر :`' + user.globalName + '` | `' + user.id + '`\nتیکت : `ticket-' + user.id + '`\nتاریخ : `' + new Date().toLocaleString() + '`')
                return Logchannel.send({ embeds: [logEmbed] })
            }

            case 'newTicket': {
                logEmbed.setColor('Blurple')
                    .setTitle('📬️ | تیکت جدیدی ایجاد شد')
                    .setDescription('اطلاعات :\n\nکاربر :`' + user.globalName + '` | `' + user.id + '`\nتیکت : `ticket-' + user.id + '`\nتاریخ : `' + new Date().toLocaleString() + '`')
                return Logchannel.send({ embeds: [logEmbed] })
            }

            case 'closeTicket': {
                logEmbed.setColor('Blurple')
                    .setTitle('🔗 | تیکت درحال بسته شدن است')
                    .setDescription('اطلاعات :\n\nکاربر :`' + user.globalName + '` | `' + user.id + '`\nتیکت : `ticket-' + customId.split("_")[1] + '`\nتاریخ : `' + new Date().toLocaleString() + '`')
                return Logchannel.send({ embeds: [logEmbed] })
            }

            case 'reopenTicket': {
                logEmbed.setColor('Blurple')
                    .setTitle('📬️ | تیکت مجددا باز شد ')
                    .setDescription('اطلاعات :\n\nکاربر :`' + user.globalName + '` | `' + user.id + '`\nتیکت : `ticket-' + customId.split("_")[1] + '`\nتاریخ : `' + new Date().toLocaleString() + '`')
                return Logchannel.send({ embeds: [logEmbed] })
            }

            case 'deleteTicket': {
                setTimeout(() => {
                    const row = new ActionRowBuilder().setComponents(Button = new ButtonBuilder().setURL(`https://discord.com/channels/${guild.id}/${Save.id}/${Save.lastMessageId}`).setEmoji("700620537503678565").setLabel('Jump to SaveLog').setStyle(ButtonStyle.Link))
                    logEmbed.setColor('Blurple')
                        .setTitle('🗑️ | تیکت با موفقیت بسته شد')
                        .setDescription('اطلاعات :\n\nکاربر :`' + user.globalName + '` | `' + user.id + '`\nتیکت : `ticket-' + customId.split("_")[1] + '`\nتاریخ : `' + new Date().toLocaleString() + '`')
                    return Logchannel.send({ embeds: [logEmbed], components: [row] })
                }, 10000);
            }

            // case 'saveTicket': {
            //     logEmbed.setColor('BLURPLE')
            //     logEmbed.setTitle('📥️ | محتوای تیکت سیو شد')
            //     logEmbed.setDescription('اطلاعات :\n\nکاربر :`' + user.tag + '` | `' + user.id + '`\nتاریخ : `' + new Date().toLocaleString() + '`')
            //     logEmbed.setFooter({ text: '', iconURL: '' });
            //     return channel.send({ embeds: [logEmbed] })
            // }
        }
    }
}