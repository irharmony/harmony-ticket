const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
let { permsToHave } = require("../config.json");

module.exports = {
  data: "reopenTicket",
  run: async (int) => {
    const channel = int.guild.channels.cache.get(int.channelId);

    await channel.edit({
      permissionOverwrites: [
        {
          id: int.guild.id,
          deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
        },
        {
          id: int.member.id,
          allow: permsToHave,
        },
        {
          allow: permsToHave,
          id: "889790617327108106",
        },
        {
          allow: permsToHave,
          id: "930971681441325117",
        },
        {
          allow: permsToHave,
          id: "969139461361381376",
        },
        {
          allow: permsToHave,
          id: "899049712294965329",
        },
        {
          allow: permsToHave,
          id: "899049713087680512",
        },
        {
          allow: permsToHave,
          id: "899049748764450816",
        },
      ],
    });

    const ticketEmbed = new MessageEmbed();

    ticketEmbed.setColor("GREEN");
    ticketEmbed.setDescription(
      "*!برای بستن تیکت میتوانید از دکمه زیر استفاده کنید\n اخطار: اگر که تیکت را بستید دیگر نمیتوانید برگردانید!*"
    );

    const closeButton = new MessageButton();

    closeButton.setStyle("DANGER");
    closeButton.setLabel("بستن تیکت");
    closeButton.setCustomId(`closeTicket_${int.customId.split("_")[1]}`);

    const row = new MessageActionRow().addComponents(closeButton);

    return int.reply({
      content: "<:check:923151545401479179> تیکت دوباره باز شد ",
      embeds: [ticketEmbed],
      components: [row],
    });
  },
};
