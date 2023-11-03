const { createWriteStream } = require('fs');
const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, ButtonStyle } = require('discord.js');
const { Database } = require("beta.db");
const db = new Database("../database/infotickets.json")
let config = require('../config')

module.exports = async (client, int) => {
    const req = int.customId.split('_')[0], { guild } = int,
        Cardinal = guild.roles.cache.get(config.Roles.Cardinal), // Cardinal
        Root = guild.roles.cache.get(config.Roles.Root), // Root
        Marshall = guild.roles.cache.get(config.Roles.Marshall), // Marshall
        YourHoner = guild.roles.cache.get(config.Roles.YourHoner), // Your Honer
        Prime = guild.roles.cache.get(config.Roles.Prime), // Prime
        Cia = guild.roles.cache.get(config.Roles.Cia), // Cia
        Minister = guild.roles.cache.get(config.Roles.Minister), // Minister
        GetAdmin = guild.roles.cache.get(config.Roles.GetAdmin)  // Orgenizer

    client.emit('ticketsLogs', req, int.guild, int.member.user);

    console.log(int.values)
    console.log(int.customId, int.user.id)
    switch (req) {
        case 'createTicket': {
            if (int.member.roles.cache.has("1151602835851583488")) return int.reply({ content: "You don't have perm for create ticket.", ephemeral: true });

            if (int.member.roles.cache.has("1151602784567828520")) {
                let button = new ButtonBuilder().setCustomId(`Banned_${int.member.id}`).setLabel('رسیدگی به شکایت').setStyle(ButtonStyle.Danger)
                const row1 = new ActionRowBuilder().addComponents([button]);
                await int.deferReply({ fetchReply: true, ephemeral: true })
                return int.editReply({ content: "در صورتی که شکایتی دارید دکمه زیرا بزنید.", components: [row1], ephemeral: true })
            }

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('newTicket')
                .setPlaceholder('دلیل باز کردن تیکت را انتخاب کنید')
                .addOptions([
                    {
                        emoji: '<a:i_:1020365613312512111>',
                        label: 'غیره',
                        description: 'سوال های عمومی',
                        value: 'newTicket_General'
                    },
                    {
                        emoji: '<:Devs:1153751188316115024>',
                        label: 'تیم ربات',
                        description: 'ارتباط با مسئولین ربات ها',
                        value: 'newTicket_Devs'
                    },
                    {
                        emoji: '<:Con:1153771850120314932>',
                        label: 'تیم کانفیگری',
                        description: 'ارتباط با مسئولین کانفیگ سرور',
                        value: 'newTicket_Configure'
                    },
                    {
                        emoji: '<:Mods:1153751222566785034>',
                        label: 'تیم مدیریت و شکایت',
                        description: 'ارتباط با تیم مدیریتی سرور و ثبت شکایت',
                        value: 'newTicket_Moderation'
                    },
                    {
                        emoji: '<:Owner:1155779741501116446>',
                        label: 'ارتباط با اونر ها',
                        description: 'ارتباط با اونر های سرور هارمونی',
                        value: 'newTicket_Owner'
                    },
                    {
                        label: 'درخواست ادمینی',
                        description: 'درخواست ادمینی در جیریت و ادولت',
                        value: 'newTicket_Admin'
                    }
                ]);
            const row = new ActionRowBuilder().addComponents([selectMenu]);
            await int.deferReply({ fetchReply: true, ephemeral: true })
            return int.editReply({ content: 'به چه دلیل تیکت باز کرده اید؟', components: [row], ephemeral: true });
        }

        case 'Banned': {
            let Hasdb = db.has(int.member.id)
            let channelID = db.get(int.member.id)
            let channel = guild.channels.cache.get(channelID)

            if (Hasdb) {
                return int.editReply({
                    content: `یوزر ${int.user}، شما تیکت باز شده دارید.\n${channel}`,
                    ephemeral: true
                })
            } else {
                db.set(int.channelId, int.member.id)
                db.set(int.member.id, int.channelId)

                const ticketEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: `ارتباط با : مدیریت سرور ` })
                    .setDescription('*!برای بستن تیکت میتوانید از دکمه زیر استفاده کنید \n اخطار: اگر که تیکت را بستید دیگر نمیتوانید برگردانید!*');

                const closeButton = new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel('بستن تیکت')
                    .setCustomId(`closeTicket`);

                const row = new ActionRowBuilder().addComponents([closeButton])

                await guild.channels.create({
                    name: `banned-${int.member.id}`,
                    type: ChannelType.text,
                    parent: config.Channels.ParentID,
                    topic: `ایجاد شده توسط : ${int.member.user.globalName}\nدرخواست ارتباط با : مدیریت سرور \n${new Date(Date.now()).toLocaleString()}`,
                    permissionOverwrites: [
                        {
                            id: int.guild.id,
                            deny: [config.Perms.DenyPermNormal]
                        },
                        {
                            id: int.member.id,
                            allow: [config.Perms.AllowPermToAdmin]
                        }
                    ]
                }).then(async (channel) => {
                    config.Roles.Access.map(async (r) => {
                        await channel.permissionOverwrites.edit(r, { ViewChannel: true, SendMessages: true })
                    })
                    await channel.send({ content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد\n${config.Roles.Access.map(r => r)}`, embeds: [ticketEmbed], components: [row] });
                    return int.editReply({ content: `<a:blackyes:969324088826949693> تیکت شما در چنل زیر باز شده است <a:blackyes:969324088826949693>\n<#${channel.id}>`, components: [], ephemeral: true });
                })
            }
        }

        case 'newTicket': {
            const reason = int.values[0].split('_')[1], IntUserID = int.customId.split("_")[1]

            let Hasdb = db.has(IntUserID)
            let channelID = db.get(IntUserID)
            let channel = guild.channels.cache.get(channelID)

            if (Hasdb) {
                return int.editReply({
                    content: `یوزر ${int.user}، شما تیکت باز شده دارید.\n${channel}`,
                    ephemeral: true
                })
            }
            else {
                db.set(int.channelId, int.member.id)
                db.set(int.member.id, int.channelId)

                await guild.channels.create({
                    name: `ticket-${int.member.id}`,
                    type: ChannelType.text,
                    parent: config.Channels.ParentID,
                    topic: `ایجاد شده توسط : ${int.member.user.globalName}\nدرخواست ارتباط با : ${reason ? ` (${reason})` : ''} \n${new Date(Date.now()).toLocaleString()}`,
                    permissionOverwrites: [
                        {
                            id: int.guild.id,
                            deny: [config.Perms.DenyPermNormal]
                        },
                        {
                            id: int.member.id,
                            allow: [config.Perms.AllowPermToAdmin]
                        }
                    ]
                }).then(async (c) => {
                    const ticketEmbed = new EmbedBuilder()
                        .setColor('Green')
                        .setAuthor({ name: `ارتباط با : ${reason ? ` (${reason})` : ''} ` })
                        .setDescription('*!برای بستن تیکت میتوانید از دکمه زیر استفاده کنید \n اخطار: اگر که تیکت را بستید دیگر نمیتوانید برگردانید!*')

                    const closeButton = new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setLabel('بستن تیکت')
                        .setCustomId(`closeTicket_${IntUserID}`)

                    const row = new ActionRowBuilder().addComponents([closeButton]);
                    if (int.values[0] === 'newTicket_Devs') {
                        await c.send({ content: `${int.member} تیکت شما با موفقیت ساخته شد\n<@&988140030180614174>`, embeds: [ticketEmbed], components: [row] });
                    } else if (int.values[0] === 'newTicket_Configure') {
                        await c.send({ content: `${int.member} تیکت شما با موفقیت ساخته شد\n<@&1139624865071104183>`, embeds: [ticketEmbed], components: [row] });
                    } else if (int.values[0] === 'newTicket_Moderation') {
                        config.Roles.Access.map(async (r) => {
                            await c.permissionOverwrites.edit(r, { ViewChannel: true, SendMessages: true })
                        })
                        await c.send({ content: `${int.member} تیکت شما با موفقیت ساخته شد\n${config.Roles.Access.map(r => r)}`, embeds: [ticketEmbed], components: [row] });
                    } else if (int.values[0] === 'newTicket_Admin') {
                        config.Roles.Access.map(async (r) => {
                            await c.permissionOverwrites.edit(r, { ViewChannel: true, SendMessages: true })
                        })
                        await c.permissionOverwrites.edit(GetAdmin, { ViewChannel: true, SendMessages: true }).then(() => {
                            c.send({ content: `${int.member} تیکت شما با موفقیت ساخته شد\n$${config.Roles.Access.map(r => r)}, ${GetAdmin}`, embeds: [ticketEmbed], components: [row] });
                        })
                    } else if (int.values[0] === 'newTicket_Owner') {
                        await c.send({ content: `${int.member} تیکت شما با موفقیت ساخته شد\n<@&1077282365853937734>`, embeds: [ticketEmbed], components: [row] });
                    } else {
                        await c.send({ content: `${int.member} تیکت شما با موفقیت ساخته شد`, embeds: [ticketEmbed], components: [row] });
                    }
                    return int.update({ content: `<a:blackyes:969324088826949693> تیکت شما در چنل زیر باز شده است <a:blackyes:969324088826949693>\n${channel}`, components: [], ephemeral: true });
                })
            }
        }

        case 'closeTicket': {
            const IntUserID = int.customId.split("_")[1]

            let channelID = db.get(IntUserID)
            let channel = guild.channels.cache.get(channelID)

            await channel.permissionOverwrites.edit(IntUserID, { ViewChannel: false })

            const ticketEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('*برای بستن تیکت و یا باز کردن دوباره آن از دکمه های زیر میتوانید استفاده کنید*');

            const reopenButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel('دوباره باز کردن')
                .setCustomId(`reopenTicket_${IntUserID}`);

            const deleteButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel('حذف تیکت')
                .setCustomId('deleteTicket');

            const row = new ActionRowBuilder().addComponents([reopenButton, deleteButton]);

            return int.editReply({ content: '<:ignore:969323939094478918> عملیات بستن تیکت', embeds: [ticketEmbed], components: [row] });
        }

        case 'reopenTicket': {
            const IntUserID = int.customId.split("_")[1]

            let channelID = db.get(IntUserID)
            let channel = guild.channels.cache.get(channelID)

            await channel.permissionOverwrites.edit(IntUserID, { ViewChannel: true })

            const ticketEmbed = new EmbedBuilder()
                .setColor('Green')
                .setDescription('*!برای بستن تیکت میتوانید از دکمه زیر استفاده کنید\n اخطار: اگر که تیکت را بستید دیگر نمیتوانید برگردانید!*');

            const closeButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel('بستن تیکت')
                .setCustomId(`closeTicket_${IntUserID}`);

            const row = new ActionRowBuilder().addComponents([closeButton]);

            return int.editReply({ content: '<a:blackyes:969324088826949693> تیکت دوباره باز شد ', embeds: [ticketEmbed], components: [row] });
        }

        case 'deleteTicket': {
            const channel = guild.channels.cache.get(int.channelId), LogChannel = guild.channels.cache.get(config.Channels.LogSave)

            await channel.messages.fetch().then(async msg => {
                let messages = msg.filter(msg => msg.author.bot !== true).map(m => {
                    const date = new Date(m.createdTimestamp).toLocaleString();
                    const user = `${m.author.tag}${m.author.id === int.customId.split('_')[1] ? ' (ticket creator)' : ''}`;

                    return `${date} - ${user} : ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`;
                }).reverse().join('\n');

                if (messages.length < 1) messages = 'محتوایی در این تیکت یافت نشد !!!';

                const ticketID = Date.now();

                const stream = await createWriteStream(`./data/${ticketID}.txt`);

                stream.once('open', () => {
                    stream.write(`User ticket ${int.customId.split('_')[1]} (channel #${channel.name})\n\n`);
                    stream.write(`${messages}\n\nLogs ${new Date(ticketID).toLocaleString()}`);

                    stream.end();
                });

                stream.on('finish', () => {
                    LogChannel.send({ files: [`./data/${ticketID}.txt`] })
                });
            });
            setTimeout(() => {
                channel.delete();
            }, 5000);
        }
    }
};