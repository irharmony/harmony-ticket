const { Client } = require('discord.js');

global.client = new Client({
    intents: "3276799", disableMentions: 'everyone'
});

const config = require('./config');

require('./src/loader');

client.login(config.Client.Token);

process.on('unhandledRejection', err => {
    console.log(err);
});