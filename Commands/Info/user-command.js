const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const config = require("../../config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('User Commands')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('info')
                .setDescription('Information über einen User bekommen')
                .addUserOption(option => option.setName('user').setDescription('user').setRequired(false)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('invites')
                .setDescription('Information über die Invites eines Users bekommen')
                .addUserOption(option => option.setName('user').setDescription('user').setRequired(false)),
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'info') {
            const user = interaction.options.getUser('user') || interaction.user;
            const member = await interaction.guild.members.fetch(user.id);
            const icon = user.displayAvatarURL();
            const tag = user.tag;


            const embed = new EmbedBuilder()
                .setAuthor({ name: tag, iconURL: icon })
                .setTitle('Userinfo')
                .setColor(config.settings.color)
                .setThumbnail(icon)
                .addFields({ name: "User:", value: `${user}`, inline: true })
                .addFields({ name: "Name:", value: `${user.tag}`, inline: true })
                .addFields({ name: "ID:", value: `${user.id}`, inline: true })
                .addFields({ name: " ", value: "\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n" })
                .addFields({ name: "Rollen", value: `${member.roles.cache.map(r => r).join(' ')}`, inline: false })
                .addFields({ name: " ", value: "\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n" })
                .addFields({ name: "Server Beigetreten", value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true })
                .addFields({ name: "Discord Beigetreten", value: `<t:${parseInt(user.createdAt / 1000)}:R>`, inline: true })
                .setTimestamp()
                .setFooter({ text: config.texte.footer, iconURL: icon })

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })

        } else if (subcommand === 'invites') {
            const user = interaction.options.getUser('user') || interaction.user;
            const icon = user.displayAvatarURL();
            const tag = user.tag;

            try {
                let invites = await interaction.guild.invites.fetch();
                let userInv = invites.filter(invite => invite.inviter && invite.inviter.id === user.id);
                let inviteCount = 0;

                userInv.forEach(invite => {
                    if (invite.uses) {
                        inviteCount += invite.uses;
                    }
                });

                const embed = new EmbedBuilder()
                    .setAuthor({ name: tag, iconURL: icon })
                    .setColor(config.settings.color)
                    .setThumbnail(icon)
                    .setDescription(`${user.tag} hat **${inviteCount}** Einladungen`)
                    .setTimestamp()
                    .setFooter({ text: config.texte.footer, iconURL: config.icon });

                await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
                await interaction.channel.send({ embeds: [embed] });

            } catch (error) {
                console.error('Error fetching invites:', error);
                await interaction.reply({ content: 'Es gab einen Fehler beim Abrufen der Einladungen.', ephemeral: true });
            }
        }
    }
}