// Utils
require("dotenv").config();
const { Client, Intents } = require("discord.js");

// Create a new Discord client
global.client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// Starting the Client
require("./src/loader");

// logging in to the discord Client
client.login(process.env.token);

process.on("unhandledRejection", (err) => {
  console.log(err);
});
