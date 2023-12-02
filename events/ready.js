const config = require('../config')
const { Events } = require('discord.js');
module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        console.log(`${client.user.username} ready to manage tickets !`);

        setInterval(() => {
            var COUNT = client.channels.cache.filter(c => c.parentId === config.Channels.ParentID).size

            client.user.setPresence({
                status: 'dnd',
                activities: [{
                    type: 'WATCHING',
                    name: COUNT + ' Open Tickets',
                }]
            });
        }, 60000);
    }
}