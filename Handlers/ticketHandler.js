const { Events, ChannelType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
const config = require('../config.js');

function ticketHandler(client) {

    let ticketCount = 0;
    let ticketCreators = new Map();

    client.on(Events.InteractionCreate, async interaction => {
        try {
            if (interaction.isStringSelectMenu() && interaction.customId === 'ticket') {
                const ticketType = interaction.values[0];
                const ticketConfig = config.ticket[ticketType];
                
                if (!ticketConfig) return;

                ticketCount += 1;
                const channel = await interaction.guild.channels.create({
                    name: `${ticketConfig.channelName}-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    parent: ticketConfig.categoryId,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: ticketConfig.role,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });

                ticketCreators.set(channel.id, interaction.user.id);

                const embed = new EmbedBuilder()
                    .setTitle(`${ticketConfig.name} Ticket`)
                    .setDescription(`Dein Ticket wurde erstellt! Das Team wird sich gleich darum kümmern.\n\n**Informationen über das Ticket**\n- Ticket opener: ${interaction.user}\n- Ticket Team: <@&${ticketConfig.role}>\n- Ticket Kategorie: __${ticketConfig.name}__\n- Geöffnet: <t:${parseInt((interaction).createdTimestamp / 1000)}:R>\n- Ticket Nummer: ${ticketCount}`)
                    .setColor(config.settings.color)
                    .setTimestamp()
                    .setImage(config.bot.images.banner)
                    .setFooter({ text: config.texte.footer });

                const closeBtn = new ButtonBuilder()
                    .setEmoji(config.icons.ticketClose)
                    .setLabel('Ticket schließen')
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId('confirmCloseTicket');

                const transcriptBtn = new ButtonBuilder()
                    .setEmoji(config.icons.transcript)
                    .setLabel('Transcript Ticket')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('transcriptBtn');

                const claimBtn = new ButtonBuilder()
                    .setEmoji(config.icons.claim)
                    .setLabel('Claim Ticket')
                    .setStyle(ButtonStyle.Success)
                    .setCustomId('claimBtn');

                const row = new ActionRowBuilder().addComponents(closeBtn, transcriptBtn, claimBtn);

                await channel.send(`<@&${config.roles.team}> │ ${interaction.user}`);
                await channel.send({ embeds: [embed], components: [row] });

                await interaction.reply({ content: `Dein Ticket wurde erstellt: ${channel}`, ephemeral: true });
            }

            if (interaction.isButton()) {
                if (interaction.customId === 'transcriptBtn') {
                    const channel = interaction.channel;
                    const attachment = await discordTranscripts.createTranscript(channel, {
                        filename: `${interaction.channel.name}.html`,
                        poweredBy: false,
                        saveImages: true,
                    });
                    await interaction.reply({ files: [attachment] });
                }

                if (interaction.customId === 'claimBtn') {
                    const hasRole = (interaction.member.roles.cache.has(config.roles.admin) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
                    if (!hasRole) {
                        interaction.reply({ content: "Du hast keine Berechtigung dazu.", ephemeral: true })
                    } else {
                        const embed = new EmbedBuilder()
                            .setTitle('Ticket Claim')
                            .addFields(
                                { name: '👤 » Geclaimt von:', value: `${interaction.member}`, inline: true },
                                { name: '🕔 » Uhrzeit:', value: `<t:${parseInt((interaction.createdTimestamp) / 1000)}:R>`, inline: true },
                                { name: '\u200B', value: `*Falls ${interaction.member} nicht mehr weiterkommt, kann er das Ticket weitergeben!*`, inline: false },
                            )
                            .setColor(config.settings.color);
    
                        const claimBtnweitergeben = new ButtonBuilder()
                            .setEmoji(config.icons.ticketweitergeben)
                            .setLabel('Ticket weitergeben')
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId('claimBtnweitergeben');
    
                        const row = new ActionRowBuilder().addComponents(claimBtnweitergeben);
                        await interaction.reply({ embeds: [embed], components: [row] });
                    }
                }

                if (interaction.customId === 'claimBtnweitergeben') {
                    const channel = interaction.channel;
                    const embed = new EmbedBuilder()
                        .setTitle('Ticket wird ans Team weitergegeben')
                        .addFields(
                            { name: '👤 » Weitergegeben von:', value: `${interaction.member}`, inline: true },
                            { name: '🕔 » Uhrzeit:', value: `<t:${parseInt((interaction.createdTimestamp) / 1000)}:R>`, inline: true },
                        )
                        .setColor(config.settings.color);

                    const claimubernehmen = new ButtonBuilder()
                        .setEmoji(config.icons.claim)
                        .setLabel('Ticket übernehmen')
                        .setStyle(ButtonStyle.Success)
                        .setCustomId('claimBtn');

                    const row = new ActionRowBuilder().addComponents(claimubernehmen);
                    await channel.send(`<@&${config.roles.team}> │ ${interaction.user}`);
                    await channel.send({ embeds: [embed], components: [row] });
                    await interaction.message.delete();
                }

                if (interaction.customId === 'confirmCloseTicket') {
                    const channel = interaction.channel;
                    const creatorId = ticketCreators.get(channel.id);
                    const ticketLogChannel = client.channels.cache.get(config.channels.ticketLog);

                    const embed = new EmbedBuilder()
                        .setTitle(`Ticket Log - Ticket Deleted`)
                        .setDescription(`${interaction.channel.name} wurde gelöscht von ${interaction.user}`)
                        .addFields(
                            { name: '👤 » Geschlossen von:', value: `${interaction.member}`, inline: true },
                            { name: '🕔 » Geschlossen:', value: `<t:${parseInt((interaction.createdTimestamp) / 1000)}:R>`, inline: true },
                        )
                        .setColor(config.settings.color)
                        .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo });

                    const attachment = await discordTranscripts.createTranscript(channel, {
                        filename: `Ticket-${interaction.user.username}.html`,
                        poweredBy: false,
                        saveImages: true,
                    });

                    if (creatorId) {
                        const closedEmbed = new EmbedBuilder()
                            .setTitle(`Ticket geschlossen`)
                            .setDescription(`Dein Ticket auf __${interaction.guild.name}__ wurde geschlossen.\n\n- <t:${parseInt((interaction.createdTimestamp) / 1000)}:R>`)
                            .setColor(config.settings.color)
                            .setTimestamp()
                            .setImage(config.bot.images.banner)
                            .setFooter({ text: config.texte.footer });
                        await client.users.send(creatorId, { embeds: [closedEmbed], files: [attachment] });
                        ticketCreators.delete(channel.id);
                    }

                    await interaction.channel.delete();
                    await ticketLogChannel.send({ embeds: [embed] });
                    await ticketLogChannel.send({ files: [attachment] });
                }
            }
        } catch (error) {
            console.error('Error handling interaction:', error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.', ephemeral: true });
            }
        }
    });
}

module.exports = { ticketHandler };