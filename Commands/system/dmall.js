const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

const config = require("../../config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dmall')
        .setDescription('Sendet eine dm an alle Member.')
        .addStringOption(option => option.setName('input').setDescription('Inhalt der DM-All').setRequired(true)),

    async execute(interaction) {

        const { options, user } = interaction;

        if (!(interaction.member.roles.cache.has(config.roles.admin) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))) return interaction.reply({ content: config.texte.invalidRole, ephemeral: true })

        const guild = interaction.guild;
        const members = await guild.members.fetch();
        const inhalt = options.getString('input');

        const embed = new EmbedBuilder()
            .setColor(config.settings.color)
            .setThumbnail(config.bot.images.logo)
            .setDescription(`${inhalt}`);

        const button = new ButtonBuilder()
            .setCustomId('gesendetVon')
            .setLabel(`Gesendet von: ${interaction.guild}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);

        const row = new ActionRowBuilder()
            .addComponents(button);

        let count = 0;
        members.forEach(member => {
            if (!member.user.bot) {
                member.send({ embeds: [embed], components: [row] })
                    .then(() => console.log(`DM sent to ${member.user.tag}`))
                    .catch(error => console.error(`Could not send DM to ${member.user.tag}:, ${error}`));
                count += 1;
            }
        });

        if (count != 1)
            await interaction.reply({ content: 'Mass DM sent to ' + count + ' Users !', ephemeral: true });
        else
            await interaction.reply({ content: 'Mass DM sent to ' + count + ' User !', ephemeral: true });
    }
}