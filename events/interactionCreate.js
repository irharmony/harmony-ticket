const { createWriteStream } = require('fs');
const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, ButtonStyle, roleMention, PermissionFlagsBits, Events, ComponentType } = require('discord.js');
const { Database } = require("beta.db");
const db = new Database("./database/infotickets.json")
let config = require('../config')


module.exports = {
    name: Events.InteractionCreate,
    async execute(int, client) {

        const req = int.customId.split('_')[0], { guild } = int;

        client.emit('ticketsLogs', req, int);

        switch (req) {
            case 'createTicket': {
                if (int.member.roles.cache.has(config.Roles.NoTicket)) return int.reply({ content: "You don't have perm for create ticket.", ephemeral: true });

                if (int.member.roles.cache.has(config.Roles.Banned)) {
                    let button = new ButtonBuilder().setCustomId(`Banned_${int.member.id}`).setLabel('رسیدگی به شکایت').setStyle(ButtonStyle.Danger)
                    const row1 = new ActionRowBuilder().addComponents([button]);
                    await int.deferReply({ fetchReply: true, ephemeral: true })
                    return int.editReply({ content: "در صورتی که شکایتی دارید دکمه زیرا بزنید.", components: [row1], ephemeral: true })
                }

                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId(`newTicket_${int.member.id}`)
                    .setPlaceholder('دلیل باز کردن تیکت را انتخاب کنید')
                    .addOptions([
                        {
                            emoji: '<a:i_:1020365613312512111>',
                            label: 'نقد و انتقادات',
                            description: 'نقد و انتقادات',
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
                            label: ' تیم رسیدگی و شکایت',
                            description: 'درخواست ارتباط با تیم رسیدگی برای پیگیری شکایت',
                            value: 'newTicket_Jug'
                        },
                        {
                            emoji: '<:Mods:1153751222566785034>',
                            label: 'تیم مدیریت',
                            description: 'ارتباط با تیم مدیریتی سرور',
                            value: 'newTicket_Moderation'
                        },
                        {
                            emoji: '',
                            label: 'درخواست چنل',
                            description: 'درخواست چنل در سکشن zone',
                            value: 'newTicket_Channel'
                        }
                    ]);
                const row = new ActionRowBuilder().addComponents([selectMenu]);
                await int.deferReply({ fetchReply: true, ephemeral: true })
                int.editReply({ content: 'به چه دلیل تیکت باز کرده اید؟', components: [row], ephemeral: true });
            }
                break;
            case 'Banned': {
                let channel = guild.channels.cache.find(x => x.name === `banned-${int.member.id}`);

                if (channel) {
                    return int.update({
                        ephemeral: true,
                        embeds: [],
                        content: `You have a channel ticket.\n ${channel}`
                    })
                } else {
                    const ticketEmbed = new EmbedBuilder()
                        .setColor("Green")
                        .setAuthor({ name: `ارتباط با : مدیریت سرور ` })
                        .setDescription('*!برای بستن تیکت میتوانید از دکمه زیر استفاده کنید \n اخطار: اگر که تیکت را بستید دیگر نمیتوانید برگردانید!*');

                    const closeButton = new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setLabel('بستن تیکت')
                        .setCustomId(`closeTicket_${int.member.id}`);

                    const row = new ActionRowBuilder().addComponents([closeButton])

                    await guild.channels.create({
                        name: `banned-${int.member.id}`,
                        type: ChannelType.GuildText,
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
                        db.set(channel.id, {
                            creator: int.member.id
                        })
                        config.Roles.Jug.map(async (r) => {
                            await channel.permissionOverwrites.edit(r, { ViewChannel: true, SendMessages: true })
                        })
                        await channel.send({ content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد\n${config.Roles.Jug.map(r => roleMention(r))}`, embeds: [ticketEmbed], components: [row] });
                        await int.update({ content: `<a:blackyes:969324088826949693> تیکت شما در چنل زیر باز شده است <a:blackyes:969324088826949693>\n${channel}`, components: [], embeds: [], ephemeral: true });
                    })
                }
            }
                break;
            case 'newTicket': {
                const reason = int.values[0].split('_')[1], IntUserID = int.customId.split("_")[1]
                let channel = guild.channels.cache.find(x => x.name === `ticket-${int.member.id}`);

                if (channel) {
                    return int.update({
                        ephemeral: true,
                        embeds: [],
                        content: `You have a channel ticket.\n ${channel}`
                    })
                } else {
                    await guild.channels.create({
                        name: `ticket-${int.member.id}`,
                        type: ChannelType.GuildText,
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
                        db.set(c.id, {
                            creator: IntUserID
                        })
                        const ticketEmbed = new EmbedBuilder()
                            .setColor('Green')
                            .setAuthor({ name: `ارتباط با : ${reason ? ` (${reason})` : ''} ` })
                            .setDescription('*!برای بستن تیکت میتوانید از دکمه زیر استفاده کنید \n اخطار: اگر که تیکت را بستید دیگر نمیتوانید برگردانید!*')

                        const closeButton = new ButtonBuilder()
                            .setStyle(ButtonStyle.Danger)
                            .setLabel('بستن تیکت')
                            .setCustomId(`closeTicket_${IntUserID}`)

                        const move = new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setLabel('انتقال به سکشن دیگر')
                            .setCustomId(`moveSection_${IntUserID}`)

                        const row = new ActionRowBuilder().addComponents([closeButton, move]);
                        if (int.values[0] === 'newTicket_Devs') {
                            await c.send({ content: `${int.member} تیکت شما با موفقیت ساخته شد\n<@&988140030180614174>`, embeds: [ticketEmbed], components: [row] });
                        } else if (int.values[0] === 'newTicket_Configure') {
                            await c.permissionOverwrites.edit("1185176342266916965", { ViewChannel: true, SendMessages: true })
                            await c.send({ content: `${int.member} تیکت شما با موفقیت ساخته شد\n<@&1139624865071104183> / <@&1185176342266916965>`, embeds: [ticketEmbed], components: [row] });
                        } else if (int.values[0] === 'newTicket_Moderation') {
                            config.Roles.Moderator.map(async (r) => {
                                await c.permissionOverwrites.edit(r, { ViewChannel: true, SendMessages: true })
                            })
                            await c.send({ content: `${int.member} تیکت شما با موفقیت ساخته شد\n${config.Roles.Moderator.map(r => roleMention(r))}`, embeds: [ticketEmbed], components: [row] });
                        } else if (int.values[0] === 'newTicket_Jug') {
                            config.Roles.Jug.map(async (r) => {
                                await c.permissionOverwrites.edit(r, { ViewChannel: true, SendMessages: true })
                            })
                            await c.send({ content: `${int.member} تیکت شما با موفقیت ساخته شد\n${config.Roles.Jug.map(r => roleMention(r))}`, embeds: [ticketEmbed], components: [row] })
                        } else if (int.values[0] === "newTicket_Channel") {
                            config.Roles.Req.map(async (r) => {
                                await c.permissionOverwrites.edit(r, { ViewChannel: true, SendMessages: true })
                            })
                            await c.send({ content: `${int.member} تیکت شما با موفقیت ساخته شد\n${config.Roles.Req.map(r => roleMention(r))}`, embeds: [ticketEmbed], components: [row] })
                        } else {
                            config.Roles.Moderator.map(async (r) => {
                                await c.permissionOverwrites.edit(r, { ViewChannel: true, SendMessages: true })
                            })
                            await c.send({ content: `${int.member} تیکت شما با موفقیت ساخته شد`, embeds: [ticketEmbed], components: [row] });
                        }
                        int.update({ content: `<a:blackyes:969324088826949693> تیکت شما در چنل زیر باز شده است <a:blackyes:969324088826949693>\n${c}`, components: [], embeds: [], ephemeral: true });
                    })
                }
            }
                break;
            case 'moveSection': {
                if (!int.member.roles.cache.find(role => config.Roles.All.includes(role.id))) return
                int.reply({ content: `${int.member}, شما دسترسی به این باتن ندارید.`, ephemeral: true })
                let channel = int.channel

                const moveEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setAuthor({ name: `انتقال تیکت به سکشن دیگر` })
                    .setDescription('لطفا سکشنی که می خواهید این تیکت به ان انتقال پیدا کند را انتخاب کنید')

                const jugment = new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel('Jugment')
                    .setCustomId(`jugment`)

                const moderator = new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel('Moderator')
                    .setCustomId(`moderator`)

                const celestial = new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel('Celestial')
                    .setCustomId(`celestial`)

                const developer = new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel('Developer')
                    .setCustomId(`developer`)

                const exit = new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel('exit')
                    .setCustomId(`exit`)

                const buttonMove = new ActionRowBuilder().addComponents([jugment, moderator, celestial, developer, exit]);
                await int.deferReply({ fetchReply: true, ephemeral: true });
                let msg = await int.followUp({
                    embeds: [moveEmbed],
                    components: [buttonMove],
                    ephemeral: true
                })

                let collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 })
                collector.on("collect", async (intCol) => {
                    let moveType = intCol.customId
                    let ownerTicket = intCol.channel.name.split("-")[1]
                    if (moveType === "jugment") {
                        config.Roles.Jug.map(async (r) => {
                            await channel.permissionOverwrites.set([
                                {
                                    id: intCol.guild.id,
                                    deny: [config.Perms.DenyPermNormal]
                                },
                                {
                                    id: ownerTicket,
                                    allow: [config.Perms.AllowPermToAdmin]
                                },
                            ])
                            await channel.permissionOverwrites.edit(r, { ViewChannel: true, SendMessages: true })
                        })
                        await channel.send({ content: `${intCol.channel} تیکت شما با موفقیت منتقل شد\n${config.Roles.Jug.map(r => roleMention(r))}` });
                        await intCol.update({
                            content: `${intCol.member} منتقل شد.`,
                            embeds: [],
                            components: [],
                            ephemeral: true
                        })
                    } else if (moveType === "moderator") {
                        config.Roles.Moderator.map(async (r) => {
                            await channel.permissionOverwrites.set([
                                {
                                    id: intCol.guild.id,
                                    deny: [config.Perms.DenyPermNormal]
                                },
                                {
                                    id: ownerTicket,
                                    allow: [config.Perms.AllowPermToAdmin]
                                },
                            ])
                            await channel.permissionOverwrites.edit(r, { ViewChannel: true, SendMessages: true })
                        })
                        await channel.send({ content: `${intCol.channel} تیکت شما با موفقیت منتقل شد\n${config.Roles.Moderator.map(r => roleMention(r))}` });
                        await intCol.update({
                            content: `${intCol.member} منتقل شد.`,
                            embeds: [],
                            components: [],
                            ephemeral: true
                        })
                    } else if (moveType === "celestial") {
                        await channel.permissionOverwrites.set([
                            {
                                id: intCol.guild.id,
                                deny: [config.Perms.DenyPermNormal]
                            },
                            {
                                id: ownerTicket,
                                allow: [config.Perms.AllowPermToAdmin]
                            },
                        ])
                        await channel.send({ content: `${intCol.channel} تیکت شما با موفقیت منتقل شد\n<@&988140030180614174>` });
                        await intCol.update({
                            content: `${intCol.member} منتقل شد.`,
                            embeds: [],
                            components: [],
                            ephemeral: true
                        })
                    } else if (moveType === "developer") {
                        await channel.permissionOverwrites.set([
                            {
                                id: intCol.guild.id,
                                deny: [config.Perms.DenyPermNormal]
                            },
                            {
                                id: ownerTicket,
                                allow: [config.Perms.AllowPermToAdmin]
                            },
                            {
                                id: "1185176342266916965",
                                allow: [config.Perms.AllowPermToAdmin]
                            }
                        ])
                        await channel.send({ content: `${intCol.channel} تیکت شما با موفقیت منتقل شد\n<@&1139624865071104183> / <@&1185176342266916965>` });
                        await intCol.update({
                            content: `${intCol.member} منتقل شد.`,
                            embeds: [],
                            components: [],
                            ephemeral: true
                        })
                    } else if (moveType === "exit") return intCol.update({
                        content: `به درخواست شما این باتن کنسل شد.`,
                        embeds: [],
                        components: [],
                        ephemeral: true
                    })
                })
                collector.on("end", async (collected, reason) => {
                    if (collected.size === 0) {
                        return int.editReply({ content: "Action timeout", embeds: [], components: [], ephemeral: true })
                    } else if (collected.size === 1) {
                        return int.editReply({ components: [], ephemeral: true });
                    }
                })
            }
                break;
            case 'closeTicket': {
                try {
                    let channel = guild.channels.cache.get(int.channelId)
                    let Owner = null;
                    if (db.has(int.channelId)) {
                        Owner = db.get(int.channelId).creator
                        await channel.permissionOverwrites.edit(Owner, { ViewChannel: false })
                    }

                    const ticketEmbed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription('*برای بستن تیکت و یا باز کردن دوباره آن از دکمه های زیر میتوانید استفاده کنید*');

                    const reopenButton = new ButtonBuilder()
                        .setStyle(ButtonStyle.Success)
                        .setLabel('دوباره باز کردن')
                        .setCustomId(`reopenTicket_${Owner}`);

                    const deleteButton = new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setLabel('حذف تیکت')
                        .setCustomId(`deleteTicket_${Owner}`);

                    const row = new ActionRowBuilder().addComponents([reopenButton, deleteButton]);

                    int.reply({ content: '<:ignore:969323939094478918> عملیات بستن تیکت', embeds: [ticketEmbed], components: [row] });
                } catch (e) {
                    return console.log(e.message)
                }
            }
                break;
            case 'reopenTicket': {
                let channel = guild.channels.cache.get(int.channelId)
                let Owner = null;
                if (db.has(int.channelId)) {
                    Owner = db.get(int.channelId).creator
                    await channel.permissionOverwrites.edit(Owner, { ViewChannel: true })
                }

                const ticketEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setDescription('*!برای بستن تیکت میتوانید از دکمه زیر استفاده کنید\n اخطار: اگر که تیکت را بستید دیگر نمیتوانید برگردانید!*');

                const closeButton = new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel('بستن تیکت')
                    .setCustomId(`closeTicket_${Owner}`);

                const row = new ActionRowBuilder().addComponents([closeButton]);

                int.reply({ content: '<a:blackyes:969324088826949693> تیکت دوباره باز شد ', embeds: [ticketEmbed], components: [row] });
            }
                break;
            case 'deleteTicket': {
                await int.update({
                    content: "تیکت درحال دیلیت شدن است",
                    embeds: [],
                    components: []
                })
                const channel = guild.channels.cache.get(int.channelId), LogChannel = guild.channels.cache.get(config.Channels.LogSave);
                db.deleteEach(int.channelId)
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
                break;
        }
    }
};