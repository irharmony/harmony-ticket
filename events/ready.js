const { Category } = require('../config.json')
module.exports = (client) => {
    console.log(`${client.user.username} ready to manage tickets !`);

    setInterval(() => {
        var COUNT = client.channels.cache.filter(c => c.type === 'GUILD_TEXT' && c.parentId === Category).size

        client.user.setPresence({
            status: 'dnd',
            activities: [{
                type: 'WATCHING',
                name: COUNT + 'Open Tickets',
            }]
        });
    }, 60000);
}