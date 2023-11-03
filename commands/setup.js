const { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'setup',

    execute(client, message) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('برای استفاده از این دستور باید مجوز **MANAGE_GUILD || ADMINISTRATOR** 🚫را داشته باشید');
        }

        const setupEmbed = new EmbedBuilder()
            .setColor('Green')
            .setAuthor({ name: 'تیکت\n برای ساخت تیکت لطفا روی دکمه زیر کلیک کنید 🤝' })
            .setDescription('*یک چنل تازه برای شما ساخته میشود برای ارتباط با ما !*');

        const ticketButton = new ButtonBuilder()
            .setEmoji('🔓')
            .setStyle(ButtonStyle.Success)
            .setLabel('ساخت تیکت')
            .setCustomId('createTicket');

        const row = new ActionRowBuilder().addComponents([ticketButton]);

        message.channel.send({ embeds: [setupEmbed], components: [row] });
    },
};
