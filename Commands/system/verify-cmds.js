const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");

const config = require("../../config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verify Commands')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('panel')
                .setDescription('Sende das Verify panel'),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('self')
                .setDescription('Selfverify per Command'),
        ),

    async execute (interaction) {
        const subcommand = interaction.options.getSubcommand();

        const { options } = interaction;

        if (subcommand === 'panel') {

            if (!(interaction.member.roles.cache.has(config.roles.admin) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))) return interaction.reply({ content: config.texte.invalidRole, ephemeral: true})

            const dropRole = new ButtonBuilder()
                        .setEmoji('✅')
                        .setLabel('Verify')
                        .setCustomId('dropRole')
                        .setStyle(ButtonStyle.Success);

            const embed = new EmbedBuilder()
                .setTitle("Verifizieren")
                .setDescription("Drücke den grünen Button, um verifiziert zu werden")
                .setColor(config.settings.color)
                .setThumbnail(config.bot.images.logo)
                .setImage(config.bot.images.banner)
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo})

            const row = new ActionRowBuilder().addComponents(dropRole);

            await interaction.reply({ embeds: [embed], components: [row] });

        } else if (subcommand === 'self') {

            if (config.settings.selfverify == "true") {

                const role = config.roles.verify
                const member = interaction.member
                member.roles.add(role);

                await interaction.reply({ content: "Du bist nun verifiziert", ephemeral: true });
            } else {
                console.log('\x1b[31m Self-Verify ist deaktiviert \x1b[0m ')
                await interaction.reply({ content: "Self-Verify ist Deaktiviert, bitte wende dich an einen Administrator!", ephemeral: true });
            }

        }
    }
}