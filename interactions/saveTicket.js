const { createWriteStream } = require("fs");
module.exports = {
  name: "saveTicket",
  run: async (int) => {
    const channel = int.guild.channels.cache.get(int.channelId);

    await channel.messages.fetch().then(async (msg) => {
      let messages = msg
        .filter((msg) => msg.author.bot !== true)
        .map((m) => {
          const date = new Date(m.createdTimestamp).toLocaleString();
          const user = `${m.author.tag}${
            m.author.id === int.customId.split("_")[1]
              ? " (ticket creator)"
              : ""
          }`;

          return `${date} - ${user} : ${
            m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content
          }`;
        })
        .reverse()
        .join("\n");

      if (messages.length < 1) messages = "محتوایی در این تیکت یافت نشد !!!";

      const ticketID = Date.now();

      const stream = await createWriteStream(`./data/${ticketID}.txt`);

      stream.once("open", () => {
        stream.write(
          `User ticket ${int.customId.split("_")[1]} (channel #${
            channel.name
          })\n\n`
        );
        stream.write(
          `${messages}\n\nLogs ${new Date(ticketID).toLocaleString()}`
        );

        stream.end();
      });

      stream.on("finish", () =>
        int.reply({ files: [`./data/${ticketID}.txt`] })
      );
    });
  },
};
