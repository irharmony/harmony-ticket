const { Events } = require('discord.js');
module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot || message.channel.type === 'dm') return;

        const config = require('../config');

        if (message.content.indexOf(config.Client.prefix) !== 0) return;

        const args = message.content.slice(config.Client.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

        if (cmd) cmd.execute(client, message, args);
    }
};