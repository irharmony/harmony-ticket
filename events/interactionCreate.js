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
                    emoji: ':i_:787598077875716096>',
                    label: 'غیره',
                    description: 'سوال های عمومی',
                    value: 'newTicket_General'
                },
                {
                    emoji: '<:sos:969485741082161182>',
                    label: 'تیم رسیدگی',
                    description: 'ارتباط با ادمین های رسیدگی',
                    value: 'newTicket_Resolvers'
                },
                {
                    emoji: '<:dev:969485739555454976>',
                    label: 'تیم ربات',
                    description: 'ارتباط با مسئولین ربات ها',
                    value: 'newTicket_Devs'
                },
                {
                    emoji: '<:con:969485739064709130>',
                    label: 'تیم کانفیگری',
                    description: 'ارتباط با مسئولین کانفیگ سرور',
                    value: 'newTicket_Configure'
                },
                {
                    emoji: '<:user:923592406446772235>',
                    label: 'تیم مدیریت',
                    description: 'ارتباط با تیم مدیریتی سرور',
                    value: 'newTicket_Moderation'
                },
            ]);

            const row = new MessageActionRow().addComponents(selectMenu);

            return int.reply({ content: 'به چه دلیل تیکت باز کرده اید؟', components: [row], ephemeral: true });
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
                            id: "889790617327108106"
                        },
                        {
                            allow: permsToHave,
                            id: "930971681441325117"
                        },
                        {
                            allow: permsToHave,
                            id: "969139461361381376"
                        },
                        {
                            allow: permsToHave,
                            id: "899049712294965329"
                        },
                        {
                            allow: permsToHave,
                            id: "899049713087680512"
                        },
                        {
                            allow:permsToHave,
                            id:"899049748764450816"
                        }
                    ]
                });

                const channel = int.guild.channels.cache.find(x => x.name === `ticket-${int.member.id}`);

                const ticketEmbed = new MessageEmbed();

                ticketEmbed.setColor('GREEN');
                ticketEmbed.setAuthor({ name: `ارتباط با : ${reason ? ` (${reason})` : ''} ` });
                ticketEmbed.setDescription('*!برای بستن تیکت میتوانید از دکمه زیر استفاده کنید \n اخطار: اگر که تیکت را بستید دیگر نمیتوانید برگردانید!*');

                const closeButton = new MessageButton();

                closeButton.setStyle('DANGER');
                closeButton.setLabel('بستن تیکت');
                closeButton.setCustomId(`closeTicket_${int.member.id}`);

                const row = new MessageActionRow().addComponents(closeButton);
                if (int.values[0] === 'newTicket_Resolvers') {
                    await channel.send({ content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد\n<@&964309871321292850> / <@&930971681441325117>`, embeds: [ticketEmbed], components: [row] });
                } else if (int.values[0] === 'newTicket_Dev') {
                    await channel.send({ content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد\n<@&917436520502284309> / <@&969139461361381376>`, embeds: [ticketEmbed], components: [row] });
                } else if (int.values[0] === 'newTicket_Configure') {
                    await channel.send({ content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد\n<@&917436520502284309> / <@&889790617327108106>`, embeds: [ticketEmbed], components: [row] });
                } else if (int.values[0] === 'newTicket_Moderation') {
                    await channel.send({ content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد\n<@&899049711372210206> / <@&930965854710038599>`, embeds: [ticketEmbed], components: [row] });
                } else {
                    await channel.send({ content: `<@${int.member.user.id}> تیکت شما با موفقیت ساخته شد`, embeds: [ticketEmbed], components: [row] });
                }
                return int.update({ content: `<:check:923151545401479179> تیکت شما در چنل زیر باز شده است <:check:923151545401479179>\n<#${channel.id}>`, components: [], ephemeral: true });
            } else {
                return int.update({ content: `<:ignore:923151545569267752> شما از قبل تیکت باز کرده اید! <:ignore:923151545569267752>\n<#${channel.id}>`, components: [], ephemeral: true });
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
                        id: "889790617327108106"
                    },
                    {
                        allow: permsToHave,
                        id: "930971681441325117"
                    },
                    {
                        allow: permsToHave,
                        id: "969139461361381376"
                    },
                    {
                        allow: permsToHave,
                        id: "899049712294965329"
                    },
                    {
                        allow: permsToHave,
                        id: "899049713087680512"
                    },
                    {
                        allow:permsToHave,
                        id:"899049748764450816"
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

            return int.reply({ content: '<:ignore:923151545569267752> عملیات بستن تیکت', embeds: [ticketEmbed], components: [row] });
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
                        id: "889790617327108106"
                    },
                    {
                        allow: permsToHave,
                        id: "930971681441325117"
                    },
                    {
                        allow: permsToHave,
                        id: "969139461361381376"
                    },
                    {
                        allow: permsToHave,
                        id: "899049712294965329"
                    },
                    {
                        allow: permsToHave,
                        id: "899049713087680512"
                    },
                    {
                        allow:permsToHave,
                        id:"899049748764450816"
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

            return int.reply({ content: '<:check:923151545401479179> تیکت دوباره باز شد ', embeds: [ticketEmbed], components: [row] });
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
