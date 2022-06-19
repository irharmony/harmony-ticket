// Utils
const ora = require("ora");
const { readdirSync } = require("fs");
const { Collection } = require("discord.js");

client.commands = new Collection();
client.interactions = new Collection();

// Loading Events
const events = readdirSync("./events/").filter((file) => file.endsWith(".js")); // getting all the event files as an array

let spinner1 = ora("Loading events...").start();

events.forEach((file) => {
  const event = require(`../events/${file}`);
  spinner1.text = `-> Loaded event ${file.split(".")[0]}`;
  client.on(file.split(".")[0], event.bind(null, client));
  delete require.cache[require.resolve(`../events/${file}`)];
});
spinner1.succeed("Events loaded!");

// Loading Commands
let spinner2 = ora("Loading commands and interactions...").start();
const commands = readdirSync("./commands/").filter((file) =>
  file.endsWith(".js")
);

commands.forEach((file) => {
  const command = require(`../commands/${file}`);
  spinner2.text = `-> Loaded command ${command.name.toLowerCase()}`;
  client.commands.set(command.name.toLowerCase(), command);
  delete require.cache[require.resolve(`../commands/${file}`)];
});

// Loading interactions
const interactions = readdirSync("./interactions/").filter((file) =>
  file.endsWith(".js")
);
interactions.forEach((file) => {
  const interaction = require(`../interactions/${file}`);
  spinner2.text = `-> Loaded interaction ${interaction.name.toLowerCase()}`;
  client.interactions.set(interaction.name.toLowerCase(), interaction);
  delete require.cache[require.resolve(`../interactions/${file}`)];
});
spinner2.succeed("Commands and Interactions loaded!");
