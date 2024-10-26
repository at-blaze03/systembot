const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionsBitField } = require("discord.js");
const config = require("../../config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Ticket Commands')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('setup')
                .setDescription('Sende das Ticket Menü')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('move')
                .setDescription('Verschiebe ein Ticket in eine andere Kategorie')
                .addStringOption(option => option.setName('kategorie').setDescription('ID der Kategorie, wo das Ticket hin soll.').setRequired(true)),
        )
        .addSubcommandGroup((subcommandGroup) =>
            subcommandGroup
                .setName('user')
                .setDescription('Interaktion mit User')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('add')
                        .setDescription('Füge einen User zum Ticket hinzu')
                        .addUserOption(option => option.setName('member').setDescription('User, der zum Ticket hinzugefügt werden soll.').setRequired(true)),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('remove')
                        .setDescription('Entferne einen User vom Ticket')
                        .addUserOption(option => option.setName('member').setDescription('User, der vom Ticket entfernt werden soll.').setRequired(true)),
                ),
        ),

    async execute (interaction) {
        const subcommand = interaction.options.getSubcommand();
        const { options } = interaction;

        // Überprüfe Admin-Rollen
        if (!(interaction.member.roles.cache.has(config.roles.admin) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))) {
            return interaction.reply({ content: config.texte.invalidRole, ephemeral: true });
        }

        if (subcommand === 'setup') {
            const embed = new EmbedBuilder()
                .setTitle('**Ticket Support**')
                .setDescription('Hier kannst du ein Support-Ticket eröffnen!\n')
                .setThumbnail(config.bot.images.logo)
                .setImage(config.bot.images.banner)
                .setColor(config.settings.color);

            for (const [key, ticketConfig] of Object.entries(config.ticket)) {
                embed.addFields(
                    {
                        name: `${ticketConfig.icon} ${ticketConfig.name}`,
                        value: `${ticketConfig.desc || 'Erstelle ein Ticket'}`,
                        inline: true,
                    }
                );
            }

            const panel = new StringSelectMenuBuilder()
                .setCustomId('ticket')
                .setPlaceholder("Erstelle ein Ticket");

            // Dynamische Optionenerstellung für jedes Ticket
            for (const [key, ticketConfig] of Object.entries(config.ticket)) {
                panel.addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(ticketConfig.name)
                        .setDescription(ticketConfig.desc)
                        .setEmoji(ticketConfig.icon)
                        .setValue(key)
                );
            }

            const row = new ActionRowBuilder().addComponents(panel);

            await interaction.reply({
                embeds: [embed],
                components: [row],
            });

        } else if (subcommand === 'add') {
            const member = options.getUser('member');
            interaction.channel.permissionOverwrites.edit(
                member.id,
                { ViewChannel: true }
            ).then(() => {
                interaction.reply({
                    content: `${member} wurde erfolgreich zu ${interaction.channel} hinzugefügt`,
                    ephemeral: true,
                });
            });

        } else if (subcommand === 'remove') {
            const member = options.getUser('member');
            interaction.channel.permissionOverwrites.edit(
                member.id,
                { ViewChannel: false }
            ).then(() => {
                interaction.reply({
                    content: `${member} wurde erfolgreich von ${interaction.channel} entfernt`,
                    ephemeral: true,
                });
            });

        } else if (subcommand === 'move') {
            const GuildChannel = interaction.channel;
            const kategorie = options.getString('kategorie');

            await interaction.deferReply({ ephemeral: true });

            const parentCategory = await interaction.guild.channels.fetch(kategorie).catch(() => null);

            if (parentCategory && parentCategory.type === 4) { // Typ 4 ist für Kategorien
                GuildChannel.setParent(parentCategory).then(() => {
                    interaction.editReply({
                        content: `${interaction.channel} wurde erfolgreich in die Kategorie ${kategorie} verschoben.`,
                    });
                }).catch(error => {
                    console.error(error);
                    interaction.editReply({
                        content: `Es gab ein Problem beim Verschieben des Kanals.`,
                    });
                });
            } else {
                interaction.editReply({
                    content: `Die angegebene Kategorie existiert nicht oder ist keine gültige Kategorie.`,
                });
            }
        }
    }
};
