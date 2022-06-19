const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
let { permsToHave, Category } = require("../config.json");

module.exports = {
  name: "newTicket",
  run: async (int) => {
    const reason = int.values[0].split("_")[1];

    const channel = int.guild.channels.cache.find(
      (x) => x.name === `ticket-${int.member.id}`
    );

    if (!channel) {
      await int.guild.channels.create(`ticket-${int.member.id}`, {
        type: "GUILD_TEXT",
        parent: Category,
        topic: `ایجاد شده توسط : ${
          int.member.user.username
        }\nدرخواست ارتباط با : ${reason ? ` (${reason})` : ""} \n${new Date(
          Date.now()
        ).toLocaleString()}`,
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

      const channel = int.guild.channels.cache.find(
        (x) => x.name === `ticket-${int.member.id}`
      );

      const ticketEmbed = new MessageEmbed();

      ticketEmbed.setColor("GREEN");
      ticketEmbed.setAuthor({
        name: `ارتباط با : ${reason ? ` (${reason})` : ""} `,
      });
      ticketEmbed.setDescription(
        "*!برای بستن تیکت میتوانید از دکمه زیر استفاده کنید \n اخطار: اگر که تیکت را بستید دیگر نمیتوانید برگردانید!*"
      );

      const closeButton = new MessageButton();

      closeButton.setStyle("DANGER");
      closeButton.setLabel("بستن تیکت");
      closeButton.setCustomId(`closeTicket_${int.member.id}`);

      const row = new MessageActionRow().addComponents(closeButton);
      if (int.values[0] === "newTicket_Resolvers") {
        await channel.send({
          content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد\n<@&964309871321292850> / <@&899049712294965329> /<@&930971681441325117>`,
          embeds: [ticketEmbed],
          components: [row],
        });
      } else if (int.values[0] === "newTicket_Devs") {
        await channel.send({
          content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد\n<@&917436520502284309> / <@&969139461361381376>`,
          embeds: [ticketEmbed],
          components: [row],
        });
      } else if (int.values[0] === "newTicket_Configure") {
        await channel.send({
          content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد\n<@&917436520502284309> / <@&889790617327108106>`,
          embeds: [ticketEmbed],
          components: [row],
        });
      } else if (int.values[0] === "newTicket_Moderation") {
        await channel.send({
          content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد\n<@&899049711372210206> / <@&930965854710038599>`,
          embeds: [ticketEmbed],
          components: [row],
        });
      } else {
        await channel.send({
          content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد`,
          embeds: [ticketEmbed],
          components: [row],
        });
      }
      return int.update({
        content: `<:check:923151545401479179> تیکت شما در چنل زیر باز شده است <:check:923151545401479179>\n<#${channel.id}>`,
        components: [],
        ephemeral: true,
      });
    } else {
      return int.update({
        content: `<:ignore:923151545569267752> شما از قبل تیکت باز کرده اید! <:ignore:923151545569267752>\n<#${channel.id}>`,
        components: [],
        ephemeral: true,
      });
    }
  },
};
