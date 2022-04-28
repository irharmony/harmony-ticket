module.exports = {
    name: 'help',

    execute(client, message) {
        message.channel.send(`برای کانفیگ چنل تیکت از دستور مقابل استفاده کنید **setup** و برای دریافت پینگ بات از دستور مقابل استفاده کنید**ping** ✅`);
    },
};
