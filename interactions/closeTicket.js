const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
let { permsToHave } = require("../config.json");

module.exports = {
  name: "closeTicket",
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

    ticketEmbed.setColor("RED");
    ticketEmbed.setDescription(
      "*برای بستن تیکت و یا باز کردن دوباره آن از دکمه های زیر میتوانید استفاده کنید*"
    );

    const reopenButton = new MessageButton();

    reopenButton.setStyle("SUCCESS");
    reopenButton.setLabel("دوباره باز کردن");
    reopenButton.setCustomId(`reopenTicket_${int.customId.split("_")[1]}`);

    const saveButton = new MessageButton();

    saveButton.setStyle("SUCCESS");
    saveButton.setLabel("‌ذخیره محتوای تیکت");
    saveButton.setCustomId(`saveTicket_${int.customId.split("_")[1]}`);

    const deleteButton = new MessageButton();

    deleteButton.setStyle("DANGER");
    deleteButton.setLabel("حذف تیکت");
    deleteButton.setCustomId("deleteTicket");

    const row = new MessageActionRow().addComponents(
      reopenButton,
      saveButton,
      deleteButton
    );

    return int.reply({
      content: "<:ignore:923151545569267752> عملیات بستن تیکت",
      embeds: [ticketEmbed],
      components: [row],
    });
  },
};
