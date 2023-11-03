const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')
const config = require('../config')

module.exports = (client, type, guild, user) => {
    const channel = client.channels.cache.get(config.Channels.Log), Save = client.channels.cache.get(config.Channels.LogSave)
    const logEmbed = new EmbedBuilder(), Button = new ButtonBuilder().setURL(`https://discord.com/channels/${guild.id}/${Save.id}/${Save.lastMessageId}`).setEmoji("700620537503678565").setLabel('Jump to SaveLog').setStyle(ButtonStyle.Link),
        row = new ActionRowBuilder().setComponents(Button)

    switch (type) {

        case 'Banned': {
            logEmbed.setColor('Blurple')
                .setTitle('📬️ | تیکت جدیدی از یک فرد بن شده ایجاد شد')
                .setDescription('اطلاعات :\n\nکاربر :`' + user.globalName + '` | `' + user.id + '`\nتیکت : `ticket-' + user.id + '`\nتاریخ : `' + new Date().toLocaleString() + '`')
            return channel.send({ embeds: [logEmbed], components: [row] })
        }

        case 'newTicket': {
            logEmbed.setColor('Blurple')
                .setTitle('📬️ | تیکت جدیدی ایجاد شد')
                .setDescription('اطلاعات :\n\nکاربر :`' + user.globalName + '` | `' + user.id + '`\nتیکت : `ticket-' + user.id + '`\nتاریخ : `' + new Date().toLocaleString() + '`')
            return channel.send({ embeds: [logEmbed], components: [row] })
        }

        case 'closeTicket': {
            logEmbed.setColor('Blurple')
                .setTitle('🔗 | تیکت درحال بسته شدن است')
                .setDescription('اطلاعات :\n\nکاربر :`' + user.globalName + '` | `' + user.id + '`\nتاریخ : `' + new Date().toLocaleString() + '`')
            return channel.send({ embeds: [logEmbed], components: [row] })
        }

        case 'reopenTicket': {
            logEmbed.setColor('Blurple')
                .setTitle('📬️ | تیکت مجددا باز شد ')
                .setDescription('اطلاعات :\n\nکاربر :`' + user.globalName + '` | `' + user.id + '`\nتاریخ : `' + new Date().toLocaleString() + '`')
            return channel.send({ embeds: [logEmbed], components: [row] })
        }

        case 'deleteTicket': {
            logEmbed.setColor('Blurple')
                .setTitle('🗑️ | تیکت با موفقیت بسته شد')
                .setDescription('اطلاعات :\n\nکاربر :`' + user.globalName + '` | `' + user.id + '`\nتاریخ : `' + new Date().toLocaleString() + '`')
            return channel.send({ embeds: [logEmbed], components: [row] })
        }

        // case 'saveTicket': {
        //     logEmbed.setColor('BLURPLE')
        //     logEmbed.setTitle('📥️ | محتوای تیکت سیو شد')
        //     logEmbed.setDescription('اطلاعات :\n\nکاربر :`' + user.tag + '` | `' + user.id + '`\nتاریخ : `' + new Date().toLocaleString() + '`')
        //     logEmbed.setFooter({ text: '', iconURL: '' });
        //     return channel.send({ embeds: [logEmbed] })
        // }
    }
};
