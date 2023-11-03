const config = require('../config')
module.exports = (client) => {
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