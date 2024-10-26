const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

const config = require("../../config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Umfrage erstellen')
        .addStringOption(option => option.setName('title').setDescription('Titel der Umfrage').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Text in der Umfrage').setRequired(true))
        .addStringOption(option => option.setName('image').setDescription('Banner der Umfrage').setRequired(false))
        .addStringOption(option => option.setName('thumbnail').setDescription('Bild in der Umfrage').setRequired(false))
        .addStringOption(option => option.setName('field-name').setDescription('Feld Name in der Umfrage').setRequired(false))
        .addStringOption(option => option.setName('field-value').setDescription('Feld Text in der Umfrage').setRequired(false))
        .addStringOption(option => option.setName('footer').setDescription('Footer der Umfrage').setRequired(false)),

    async execute(interaction) {

        const { options, user } = interaction;

        if (!(interaction.member.roles.cache.has(config.roles.admin) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))) return interaction.reply({ content: config.texte.invalidRole, ephemeral: true })

        const title = options.getString('title');
        const description = options.getString('description');
        const image = options.getString('image');
        const thumbnail = options.getString('thumbnail') || config.bot.images.logo;
        const fieldn = options.getString('field-name') || ' ';
        const fieldv = options.getString('field-value') || ' ';
        const footer = options.getString('footer') || config.texte.footer;

        if (image) {
            if (!image.startsWith('http')) return await interaction.reply({ content: "Das ist kein gültiges Bild", ephemeral: true })
        }

        if (thumbnail) {
            if (!thumbnail.startsWith('http')) return await interaction.reply({ content: "Das ist kein gültiges Bild", ephemeral: true })
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(config.settings.color)
            .setImage(image)
            .setThumbnail(thumbnail)
            .setTimestamp()
            .addFields({ name: `${fieldn}`, value: `${fieldv}` })
            .setFooter({ text: `${footer}`, iconURL: config.bot.images.logo })

        await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });

        const reactionMessage = await interaction.channel.send({ embeds: [embed] });
        await reactionMessage.react(config.icons.umfrage1);
        await reactionMessage.react(config.icons.umfrage2);
    }
}