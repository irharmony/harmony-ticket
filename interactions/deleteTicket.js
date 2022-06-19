module.exports = {
  name: "deleteTicket",
  run: async (int) => {
    const channel = int.guild.channels.cache.get(int.channelId);
    return channel.delete();
  },
};
