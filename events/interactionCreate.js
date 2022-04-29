const { createWriteStream } = require('fs');
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require('discord.js');

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
                    value: 'newTicket'
                },
                {
                    emoji: '<:sos~1:969485741082161182>',
                    label: 'تیم رسیدگی',
                    description: 'ارتباط با ادمین های رسیدگی',
                    value: 'newTicket_SOS'
                },
                {
                    emoji: '<:dev~1:969485739555454976>',
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
                    emoji: '<:con:969485739064709130>',
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
                let permsToHave = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS']

                await int.guild.channels.create(`ticket-${int.member.id}`, {
                    type: 'GUILD_TEXT',
                    parent: '931114136459436092',
                    topic: `ایجاد شده توسط : ${int.member.user.username}
                    درخواست ارتباط با : ${reason ? ` (${reason})` : ''} ${new Date(Date.now()).toLocaleString()}`,
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
                        }
                    ]
                });

                const channel = int.guild.channels.cache.find(x => x.name === `ticket-${int.member.id}`);

                const ticketEmbed = new MessageEmbed();

                ticketEmbed.setColor('GREEN');
                ticketEmbed.setAuthor(`تیکت شما با موفقیت ساخته شد ${int.member.user.username}${reason ? ` (${reason})` : ''} ✅`);
                ticketEmbed.setDescription('*!برای بستن تیکت میتوانید از دکمه زیر استفاده کنید ، اخطار: اگر که تیکت را بستید دیگر نمیتوانید برگردانید!*');

                const closeButton = new MessageButton();

                closeButton.setStyle('DANGER');
                closeButton.setLabel('بستن تیکت');
                closeButton.setCustomId(`closeTicket_${int.member.id}`);

                const row = new MessageActionRow().addComponents(closeButton);

                await channel.send({ embeds: [ticketEmbed], components: [row] });

                return int.update({ content: `تیکت شما در چنل باز شده است <#${channel.id}> ✅`, components: [], ephemeral: true });
            } else {
                return int.update({ content: `شما از قبل تیکت باز کرده اید! <#${channel.id}> ❌`, components: [], ephemeral: true });
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
                        id: int.customId.split('_')[1],
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: client.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    }
                ]
            });

            const ticketEmbed = new MessageEmbed();

            ticketEmbed.setColor('RED');
            ticketEmbed.setAuthor(`${int.member.user.username} بستن تیکت را رد کرد ❌`);
            ticketEmbed.setDescription('*برای بستن تیکت و یا باز کردن دوباره آن از دکمه های زیر میتوانید استفاده کنید*');

            const reopenButton = new MessageButton();

            reopenButton.setStyle('SUCCESS');
            reopenButton.setLabel('دوباره باز کردن');
            reopenButton.setCustomId(`reopenTicket_${int.customId.split('_')[1]}`);

            const saveButton = new MessageButton();

            saveButton.setStyle('SUCCESS');
            saveButton.setLabel('Save this ticket');
            saveButton.setCustomId(`saveTicket_${int.customId.split('_')[1]}`);

            const deleteButton = new MessageButton();

            deleteButton.setStyle('DANGER');
            deleteButton.setLabel('حذف تیکت');
            deleteButton.setCustomId('deleteTicket');

            const row = new MessageActionRow().addComponents(reopenButton, saveButton, deleteButton);

            return int.reply({ embeds: [ticketEmbed], components: [row] });
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
                        id: int.customId.split('_')[1],
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: client.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    }
                ]
            });

            const ticketEmbed = new MessageEmbed();

            ticketEmbed.setColor('GREEN');
            ticketEmbed.setAuthor(`تیکت دوباره باز شد✅`);
            ticketEmbed.setDescription('*!برای بستن تیکت میتوانید از دکمه زیر استفاده کنید ، اخطار: اگر که تیکت را بستید دیگر نمیتوانید برگردانید!*');

            const closeButton = new MessageButton();

            closeButton.setStyle('DANGER');
            closeButton.setLabel('بستن تیکت');
            closeButton.setCustomId(`closeTicket_${int.customId.split('_')[1]}`);

            const row = new MessageActionRow().addComponents(closeButton);

            return int.reply({ embeds: [ticketEmbed], components: [row] });
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

                if (messages.length < 1) messages = 'There are no messages in this ticket... strange';

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
