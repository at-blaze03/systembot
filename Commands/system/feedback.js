const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const config = require("../../config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Lasse ein Feedback da!')
        .addStringOption(option => option.setName('bewertung').setDescription('Verteile Sterne').setRequired(true)
            .addChoices(
                { name: '⭐️⭐️⭐️⭐️⭐️', value: '⭐️⭐️⭐️⭐️⭐️' },
                { name: '⭐️⭐️⭐️⭐️', value: '⭐️⭐️⭐️⭐️' },
                { name: '⭐️⭐️⭐️', value: '⭐️⭐️⭐️' },
                { name: '⭐️⭐️', value: '⭐️⭐️' },
                { name: '⭐️', value: '⭐️' }
            ))
        .addStringOption(option => option.setName('anmerkung').setDescription('Schreibe dein Feedback').setRequired(true))
        .addUserOption(option => option.setName('teamler').setDescription('Teamler dem du Feedback hinterlassen möchtest').setRequired(true)),


    async execute(interaction) {

        const { client, options } = interaction;
        const feedbackChannel = client.channels.cache.get(config.channels.feedbackChannel)

        const bewertung = options.getString('bewertung');
        const anmerkung = options.getString('anmerkung');
        const teamler = options.getUser('teamler');

        const embed = new EmbedBuilder()
            .setTitle('Feedback')
            .setDescription(`Feedback von ${interaction.member}`)
            .addFields(
                { name: 'Bewertung:', value: `${bewertung}` },
                { name: 'Anmerkung:', value: `${anmerkung}`, inline: true },
                { name: 'Teamler:', value: `${teamler}`, inline: true },
            )
            .setColor(config.settings.color)
            .setTimestamp()
            .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo })

        await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
        await feedbackChannel.send({ embeds: [embed] });
    }
}