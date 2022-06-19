// Utils
const ora = require("ora");
const { Category } = require("../config.json");

let botLoader = ora("Starting discord.js Client").start();

module.exports = (client) => {
  botLoader.succeed(`${client.user.tag} ready to manage tickets !`);

  // Setting an interval to change the bot's presence
  setInterval(() => {
    var COUNT = client.channels.cache.filter(
      (c) => c.type === "GUILD_TEXT" && c.parentId === Category
    ).size;

    client.user.setPresence({
      status: "dnd",
      activities: [
        {
          type: "WATCHING",
          name: COUNT + " Open Tickets",
        },
      ],
    });
  }, 60000);
};
