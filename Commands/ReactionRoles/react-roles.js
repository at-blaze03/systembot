const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionsBitField } = require("discord.js");
const config = require("../../config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reaction-roles')
        .setDescription('Reaction Roles Commands'),

    async execute(interaction) {
        if (!(interaction.member.roles.cache.has(config.roles.admin) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))) {
            return interaction.reply({ content: config.texte.invalidRole, ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('**Reaction Roles**')
            .setDescription('Wähle eine Rolle aus, welche du erhalten möchtest')
            .setThumbnail(config.bot.images.logo)
            .setImage(config.bot.images.banner)
            .setColor(config.settings.color);

        const panel = new StringSelectMenuBuilder()
            .setCustomId('r-roles')
            .setPlaceholder("Wähle eine Rolle");

        for (const [key, role] of Object.entries(config.reactionRoles.roles)) {
            panel.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(role.name)
                    .setDescription(role.desc)
                    .setEmoji(role.emoji)
                    .setValue(`r-${key}`)
            );
        }

        const row = new ActionRowBuilder()
            .addComponents(panel);

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    }
}