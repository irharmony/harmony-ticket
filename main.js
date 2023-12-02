const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');

global.client = new Client({
    intents: "3276799", disableMentions: 'everyone'
});

const config = require('./config');

client.commands = new Collection();

const events = readdirSync('./events/').filter(file => file.endsWith('.js'));

console.log(`Loading events...`);

for (const file of events) {
    const event = require(`./events/${file}`);
    console.log(`-> Loaded event ${file.split('.')[0]}`);
    client.on(event.name, (...args) => event.execute(...args, client));
};

console.log(`Loading commands...`);

const commands = readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commands) {
    const command = require(`./commands/${file}`);
    console.log(`-> Loaded command ${command.name.toLowerCase()}`);
    client.commands.set(command.name.toLowerCase(), command);
};

client.login(config.Client.Token);

process.on('unhandledRejection', (reason, p) => {
    console.log('[antiCrash] :: Unhandled Rejection/Catch');
    console.log(reason?.stack, p);
});