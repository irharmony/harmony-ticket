const { MessageEmbed } = require('discord.js')
const { Log } = require('../config.json')

module.exports = (client, type, guild, user) => {
const channel = client.guild.channels.cache.get(Log)
const logEmbed = new MessageEmbed()

    switch (type) {

        case 'newTicket': {

            .setColor('') 
            .setTitle('')
            .setAuthor({ name: '', iconURL: '', url: '' }) 
            .setDescription('') 	
            .setTimestamp() 	
            .setFooter({ text: '', iconURL: '' });    
            return console.log(`${user.username} just created a ticket on the server ${guild.name}`);
        }

        case 'closeTicket': {

            .setColor('') 
            .setTitle('')
            .setAuthor({ name: '', iconURL: '', url: '' }) 
            .setDescription('') 	
            .setTimestamp() 	
            .setFooter({ text: '', iconURL: '' });
            return console.log(`${user.username} just closed a ticket on the server ${guild.name}`);
        }

        case 'reopenTicket': {

            .setColor('') 
            .setTitle('')
            .setAuthor({ name: '', iconURL: '', url: '' }) 
            .setDescription('') 	
            .setTimestamp() 	
            .setFooter({ text: '', iconURL: '' });
            return console.log(`${user.username} just reopened a ticket on the server ${guild.name}`);
        }

        case 'deleteTicket': {

            .setColor('') 
            .setTitle('')
            .setAuthor({ name: '', iconURL: '', url: '' }) 
            .setDescription('') 	
            .setTimestamp() 	
            .setFooter({ text: '', iconURL: '' });
            return console.log(`${user.username} just deleted a ticket on the server ${guild.name}`);
        }

        case 'saveTicket': {

            .setColor('') 
            .setTitle('')
            .setAuthor({ name: '', iconURL: '', url: '' }) 
            .setDescription('') 	
            .setTimestamp() 	
            .setFooter({ text: '', iconURL: '' });
            return console.log(`${user.username} just saved a ticket on the server ${guild.name}`);
        }
    }
};
