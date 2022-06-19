const { MessageSelectMenu, MessageActionRow } = require("discord.js");

module.exports = {
  name: "createTicket",
  run: async (int) => {
    const selectMenu = new MessageSelectMenu();

    selectMenu.setCustomId("newTicket");
    selectMenu.setPlaceholder("دلیل باز کردن تیکت را انتخاب کنید");
    selectMenu.addOptions([
      {
        emoji: ":i_:787598077875716096>",
        label: "غیره",
        description: "سوال های عمومی",
        value: "newTicket_General",
      },
      {
        emoji: "<:sos:969485741082161182>",
        label: "تیم رسیدگی",
        description: "ارتباط با ادمین های رسیدگی",
        value: "newTicket_Resolvers",
      },
      {
        emoji: "<:dev:969485739555454976>",
        label: "تیم ربات",
        description: "ارتباط با مسئولین ربات ها",
        value: "newTicket_Devs",
      },
      {
        emoji: "<:con:969485739064709130>",
        label: "تیم کانفیگری",
        description: "ارتباط با مسئولین کانفیگ سرور",
        value: "newTicket_Configure",
      },
      {
        emoji: "<:user:923592406446772235>",
        label: "تیم مدیریت",
        description: "ارتباط با تیم مدیریتی سرور",
        value: "newTicket_Moderation",
      },
    ]);

    const row = new MessageActionRow().addComponents(selectMenu);

    return await int.reply({
      content: "به چه دلیل تیکت باز کرده اید؟",
      components: [row],
      ephemeral: true,
    });
  },
};
