const { MessageEmbed } = require('discord.js')
const { Log } = require('../config.json)
module.exports = (client, type, guild, user) => {
const channel = client.guild.channels.cache.get(Log)
    switch (type) {

        case 'newTicket': {
            const embed = new MessageEmbed()
            .setColor('') 
            .setTitle('')
            .setAuthor({ name: '', iconURL: '', url: '' }) 
            .setDescription('') 	
            .setTimestamp() 	
            .setFooter({ text: '', iconURL: '' });    
            return console.log(`${user.username} just created a ticket on the server ${guild.name}`);
        }

        case 'closeTicket': {
            const embed = new MessageEmbed()
            .setColor('') 
            .setTitle('')
            .setAuthor({ name: '', iconURL: '', url: '' }) 
            .setDescription('') 	
            .setTimestamp() 	
            .setFooter({ text: '', iconURL: '' });
            return console.log(`${user.username} just closed a ticket on the server ${guild.name}`);
        }

        case 'reopenTicket': {
            const embed = new MessageEmbed()
            .setColor('') 
            .setTitle('')
            .setAuthor({ name: '', iconURL: '', url: '' }) 
            .setDescription('') 	
            .setTimestamp() 	
            .setFooter({ text: '', iconURL: '' });
            return console.log(`${user.username} just reopened a ticket on the server ${guild.name}`);
        }

        case 'deleteTicket': {
            const embed = new MessageEmbed()
            .setColor('') 
            .setTitle('')
            .setAuthor({ name: '', iconURL: '', url: '' }) 
            .setDescription('') 	
            .setTimestamp() 	
            .setFooter({ text: '', iconURL: '' });
            return console.log(`${user.username} just deleted a ticket on the server ${guild.name}`);
        }

        case 'saveTicket': {
            const embed = new MessageEmbed()
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
