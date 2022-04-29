const { MessageEmbed } = require('discord.js')
const { Log } = require('../config.json')

module.exports = (client, type, guild, user) => {
    const channel = client.channels.cache.get(Log)
    const logEmbed = new MessageEmbed()

    switch (type) {

        case 'newTicket': {
            logEmbed.setColor('BLURPLE')
            logEmbed.setTitle('📬️ | تیکت جدیدی ایجاد شد')
            logEmbed.setDescription('اطلاعات :\n\nکاربر :`' + user.tag + '` | `' + user.id + '`\nتاریخ : `' + new Date().toLocaleString() + '`')
            return channel.send({ embeds: [logEmbed] })
        }

        case 'closeTicket': {
            logEmbed.setColor('BLURPLE')
            logEmbed.setTitle('🔗 | تیکت درحال بسته شدن است')
            logEmbed.setDescription('اطلاعات :\n\nکاربر :`' + user.tag + '` | `' + user.id + '`\nتاریخ : `' + new Date().toLocaleString() + '`')
            return channel.send({ embeds: [logEmbed] })
        }

        case 'reopenTicket': {
            logEmbed.setColor('BLURPLE')
            logEmbed.setTitle('📬️ | تیکت مجددا باز شد ')
            logEmbed.setDescription('اطلاعات :\n\nکاربر :`' + user.tag + '` | `' + user.id + '`\nتاریخ : `' + new Date().toLocaleString() + '`')
            return channel.send({ embeds: [logEmbed] })
        }

        case 'deleteTicket': {
            logEmbed.setColor('BLURPLE')
            logEmbed.setTitle('🗑️ | تیکت با موفقیت بسته شد')
            logEmbed.setDescription('اطلاعات :\n\nکاربر :`' + user.tag + '` | `' + user.id + '`\nتاریخ : `' + new Date().toLocaleString() + '`')
            return channel.send({ embeds: [logEmbed] })
        }

        case 'saveTicket': {
            logEmbed.setColor('BLURPLE')
            logEmbed.setTitle('📥️ | محتوای تیکت سیو شد')
            logEmbed.setDescription('اطلاعات :\n\nکاربر :`' + user.tag + '` | `' + user.id + '`\nتاریخ : `' + new Date().toLocaleString() + '`')
            logEmbed.setFooter({ text: '', iconURL: '' });
            return channel.send({ embeds: [logEmbed] })
        }
    }
};
