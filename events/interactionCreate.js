const { createWriteStream } = require('fs');
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require('discord.js');
let { permsToHave, Category } = require('../config.json')

module.exports = async (client, int) => {
    const req = int.customId.split('_')[0];

    client.emit('ticketsLogs', req, int.guild, int.member.user);

    switch (req) {
        case 'createTicket': {
            const selectMenu = new MessageSelectMenu();

            selectMenu.setCustomId('newTicket');
            selectMenu.setPlaceholder('دلیل باز کردن تیکت را انتخاب کنید');
            selectMenu.addOptions([
                {
                    emoji: '<a:i_:1020365613312512111>',
                    label: 'غیره',
                    description: 'سوال های عمومی',
                    value: 'newTicket_General'
                },
                {
                    emoji: '<a:green001:936973674320388096>',
                    label: 'تیم ربات',
                    description: 'ارتباط با مسئولین ربات ها',
                    value: 'newTicket_Devs'
                },
                {
                    emoji: '<:config:1020644221566337054>',
                    label: 'تیم کانفیگری',
                    description: 'ارتباط با مسئولین کانفیگ سرور',
                    value: 'newTicket_Configure'
                },
                {
                    emoji: '<:emoji_223:907603584504438885>',
                    label: 'تیم مدیریت',
                    description: 'ارتباط با تیم مدیریتی سرور',
                    value: 'newTicket_Moderation'
                },
            ]);
            const button = new MessageButton().setCustomId("ReqAdmin").setLabel('درخواست ادمینی').setStyle("SECONDARY")

            const row = new MessageActionRow().addComponents(selectMenu);
            const row1 = new MessageActionRow().addComponents(button);

            return int.reply({ content: 'به چه دلیل تیکت باز کرده اید؟', components: [row, row1], ephemeral: true });
        }

        case 'ReqAdmin': {
            const selectMenu = new MessageSelectMenu();
            selectMenu.setCustomId('newTicket');
            selectMenu.setPlaceholder('سکشن مورد نظر خود را وارد کنید.');
            selectMenu.addOptions([
                {
                    label: 'Grate',
                    description: 'Grate Admin',
                    value: 'newTicket_Grate'
                },
                {
                    label: 'Adult',
                    description: 'Adult Admin',
                    value: 'newTicket_Adult'
                }
            ]);
            const row = new MessageActionRow().addComponents(selectMenu);

            return int.update({ content: 'روی سکشن مورد نظر خودتون کلیک کنید.', components: [row], ephemeral: true });
        }

        case 'newTicket': {
            const reason = int.values[0].split('_')[1];

            const channel = int.guild.channels.cache.find(x => x.name === `ticket-${int.member.id}`);

            if (!channel) {

                await int.guild.channels.create(`ticket-${int.member.id}`, {
                    type: 'GUILD_TEXT',
                    parent: Category,
                    topic: `ایجاد شده توسط : ${int.member.user.username}\nدرخواست ارتباط با : ${reason ? ` (${reason})` : ''} \n${new Date(Date.now()).toLocaleString()}`,
                    permissionOverwrites: [
                        {
                            id: int.guild.id,
                            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },
                        {
                            id: int.member.id,
                            allow: permsToHave
                        },
                        {
                            allow: permsToHave,
                            id: "1151599978691702855"
                        },
                        {
                            allow: permsToHave,
                            id: "1151600128822616145"
                        },
                        {
                            allow: permsToHave,
                            id: "1151600949748564028"
                        },
                        {
                            allow: permsToHave,
                            id: "1151600958690828449"
                        },
                        {
                            allow: permsToHave,
                            id: "1151602168420376586"
                        }
                    ]
                }).then(async (channel) => {
                    let GetAdmin = int.guild.roles.cache.get("1151602163634675812")

                    if (int.values[0] === 'newTicket_Adult') {
                        channel.permissionOverwrites.edit(GetAdmin, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
                    } else if (int.values[0] === 'newTicket_Grate') {
                        channel.permissionOverwrites.edit(GetAdmin, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
                    }

                    const ticketEmbed = new MessageEmbed();

                    ticketEmbed.setColor('GREEN');
                    ticketEmbed.setAuthor({ name: `ارتباط با : ${reason ? ` (${reason})` : ''} ` });
                    ticketEmbed.setDescription('*!برای بستن تیکت میتوانید از دکمه زیر استفاده کنید \n اخطار: اگر که تیکت را بستید دیگر نمیتوانید برگردانید!*');

                    const closeButton = new MessageButton();

                    closeButton.setStyle('DANGER');
                    closeButton.setLabel('بستن تیکت');
                    closeButton.setCustomId(`closeTicket_${int.member.id}`);

                    const row = new MessageActionRow().addComponents(closeButton); 1151609030603706499
                    if (int.values[0] === 'newTicket_Devs') {
                        await channel.send({ content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد\n<@&988140030180614174>`, embeds: [ticketEmbed], components: [row] });
                    } else if (int.values[0] === 'newTicket_Configure') {
                        await channel.send({ content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد\n<@&1139624865071104183>`, embeds: [ticketEmbed], components: [row] });
                    } else if (int.values[0] === 'newTicket_Moderation') {
                        await channel.send({ content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد\n<@&1151599978691702855> / <@&1151600128822616145> / <@&1151600949748564028> / <@&1151600958690828449> / <@&1151602168420376586>`, embeds: [ticketEmbed], components: [row] });
                    } else if (int.values[0] === 'newTicket_Adult') {
                        await channel.send({ content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد\n<@&1151599978691702855> / <@&1151600128822616145> / <@&1151600949748564028> / <@&1151600958690828449> / <@&1151602168420376586> / <@&1151602163634675812>`, embeds: [ticketEmbed], components: [row] });
                    } else if (int.values[0] === 'newTicket_Grate') {
                        await channel.send({ content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد\n<@&1151599978691702855> / <@&1151600128822616145> / <@&1151600949748564028> / <@&1151600958690828449> / <@&1151602168420376586> / <@&1151602163634675812>`, embeds: [ticketEmbed], components: [row] });
                    } else {
                        await channel.send({ content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد`, embeds: [ticketEmbed], components: [row] });
                    }
                    return int.update({ content: `<a:blackyes:969324088826949693> تیکت شما در چنل زیر باز شده است <a:blackyes:969324088826949693>\n<#${channel.id}>`, components: [], ephemeral: true });
                })
            } else {
                return int.update({ content: `<a:844610530182430731:1039980064462360636> شما از قبل تیکت باز کرده اید! <a:844610530182430731:1039980064462360636>\n<#${channel.id}>`, components: [], ephemeral: true });
            }
        }

        case 'closeTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);

            await channel.edit({
                permissionOverwrites: [
                    {
                        id: int.guild.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: int.member.id,
                        allow: permsToHave
                    },
                    {
                        allow: permsToHave,
                        id: "1151599978691702855"
                    },
                    {
                        allow: permsToHave,
                        id: "1151600128822616145"
                    },
                    {
                        allow: permsToHave,
                        id: "1151600949748564028"
                    },
                    {
                        allow: permsToHave,
                        id: "1151600958690828449"
                    },
                    {
                        allow: permsToHave,
                        id: "1151602168420376586"
                    }
                ]
            });

            const ticketEmbed = new MessageEmbed();

            ticketEmbed.setColor('RED');
            ticketEmbed.setDescription('*برای بستن تیکت و یا باز کردن دوباره آن از دکمه های زیر میتوانید استفاده کنید*');

            const reopenButton = new MessageButton();

            reopenButton.setStyle('SUCCESS');
            reopenButton.setLabel('دوباره باز کردن');
            reopenButton.setCustomId(`reopenTicket_${int.customId.split('_')[1]}`);

            const saveButton = new MessageButton();

            saveButton.setStyle('SUCCESS');
            saveButton.setLabel('‌ذخیره محتوای تیکت');
            saveButton.setCustomId(`saveTicket_${int.customId.split('_')[1]}`);

            const deleteButton = new MessageButton();

            deleteButton.setStyle('DANGER');
            deleteButton.setLabel('حذف تیکت');
            deleteButton.setCustomId('deleteTicket');

            const row = new MessageActionRow().addComponents(reopenButton, saveButton, deleteButton);

            return int.reply({ content: '<:ignore:935152656090025994> عملیات بستن تیکت', embeds: [ticketEmbed], components: [row] });
        }

        case 'reopenTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);

            await channel.edit({
                permissionOverwrites: [
                    {
                        id: int.guild.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: int.member.id,
                        allow: permsToHave
                    },
                    {
                        allow: permsToHave,
                        id: "1151599978691702855"
                    },
                    {
                        allow: permsToHave,
                        id: "1151600128822616145"
                    },
                    {
                        allow: permsToHave,
                        id: "1151600949748564028"
                    },
                    {
                        allow: permsToHave,
                        id: "1151600958690828449"
                    },
                    {
                        allow: permsToHave,
                        id: "1151602168420376586"
                    }
                ]
            });

            const ticketEmbed = new MessageEmbed();

            ticketEmbed.setColor('GREEN');
            ticketEmbed.setDescription('*!برای بستن تیکت میتوانید از دکمه زیر استفاده کنید\n اخطار: اگر که تیکت را بستید دیگر نمیتوانید برگردانید!*');

            const closeButton = new MessageButton();

            closeButton.setStyle('DANGER');
            closeButton.setLabel('بستن تیکت');
            closeButton.setCustomId(`closeTicket_${int.customId.split('_')[1]}`);

            const row = new MessageActionRow().addComponents(closeButton);

            return int.reply({ content: '<a:blackyes:969324088826949693> تیکت دوباره باز شد ', embeds: [ticketEmbed], components: [row] });
        }

        case 'deleteTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);
            return channel.delete();
        }

        case 'saveTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);

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

                stream.on('finish', () => int.reply({ files: [`./data/${ticketID}.txt`] }));
            });
        }
    }
};