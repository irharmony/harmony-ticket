module.exports = async (client, int) => {
  const req = int.customId.split("_")[0];

  client.emit("ticketsLogs", req, int.guild, int.member.user);

  let intCheck = client.interactions.get(req);
  if (!intCheck) {
    return console.log(`Could not find interaction" '${req}'`);
  } else {
    await intCheck.run(int);
  }
};
