const { MessageEmbed } = require('discord.js')
const { Log } = require('../config.json')

module.exports = (client, type, guild, user) => {
    const channel = client.guild.channels.cache.get(Log)
    const logEmbed = new MessageEmbed()

    switch (type) {

        case 'newTicket': {

            logEmbed.setColor('')
            logEmbed.setTitle('')
            logEmbed.setAuthor({ name: '', iconURL: '', url: '' })
            logEmbed.setDescription('')
            logEmbed.setTimestamp()
            logEmbed.setFooter({ text: '', iconURL: '' });
            return console.log(`${user.username} just created a ticket on the server ${guild.name}`);
        }

        case 'closeTicket': {

            logEmbed.setColor('')
            logEmbed.setTitle('')
            logEmbed.setAuthor({ name: '', iconURL: '', url: '' })
            logEmbed.setDescription('')
            logEmbed.setTimestamp()
            logEmbed.setFooter({ text: '', iconURL: '' });
            return console.log(`${user.username} just closed a ticket on the server ${guild.name}`);
        }

        case 'reopenTicket': {

            logEmbed.setColor('')
            logEmbed.setTitle('')
            logEmbed.setAuthor({ name: '', iconURL: '', url: '' })
            logEmbed.setDescription('')
            logEmbed.setTimestamp()
            logEmbed.setFooter({ text: '', iconURL: '' });
            return console.log(`${user.username} just reopened a ticket on the server ${guild.name}`);
        }

        case 'deleteTicket': {

            logEmbed.setColor('')
            logEmbed.setTitle('')
            logEmbed.setAuthor({ name: '', iconURL: '', url: '' })
            logEmbed.setDescription('')
            logEmbed.setTimestamp()
            logEmbed.setFooter({ text: '', iconURL: '' });
            return console.log(`${user.username} just deleted a ticket on the server ${guild.name}`);
        }

        case 'saveTicket': {

            logEmbed.setColor('')
            logEmbed.setTitle('')
            logEmbed.setAuthor({ name: '', iconURL: '', url: '' })
            logEmbed.setDescription('')
            logEmbed.setTimestamp()
            logEmbed.setFooter({ text: '', iconURL: '' });
            return console.log(`${user.username} just saved a ticket on the server ${guild.name}`);
        }
    }
};
