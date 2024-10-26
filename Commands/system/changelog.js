const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const config = require("../../config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changelog')
        .setDescription('Changelog')
        .addStringOption(option => 
            option.setName('hinzugefügt')
                .setDescription('Was ist alles neu (mit commas)')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('geändert')
                .setDescription('Was wurde alles geändert (mit commas)')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('entfernt')
                .setDescription('Was wurde alles entfernt (mit commas)')
                .setRequired(false)),

    async execute(interaction) {
        if (!(interaction.member.roles.cache.has(config.roles.admin) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))) {
            return interaction.reply({ content: config.texte.invalidRole, ephemeral: true });
        }

        const hinzugefuegt = interaction.options.getString('hinzugefügt') || '-';
        const geaendert = interaction.options.getString('geändert') ||'-';
        const entfernt = interaction.options.getString('entfernt') || '-';

        const changelogEmbed = new EmbedBuilder()
            .setTitle('Changelog')
            .setColor(config.settings.color)
            .setDescription('Hier sind die neuesten Änderungen:')
            .addFields(
                { name: 'Hinzugefügt', value: hinzugefuegt.split(',').map(item => `• ${item.trim()}`).join('\n'), inline: false },
                { name: 'Geändert', value: geaendert.split(',').map(item => `• ${item.trim()}`).join('\n'), inline: false },
                { name: 'Entfernt', value: entfernt.split(',').map(item => `• ${item.trim()}`).join('\n'), inline: false }
            )
            .setFooter({ text: `Changelog veröffentlicht von ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [changelogEmbed] });
    }
};