const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

const config = require("../../config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('system')
        .setDescription('System Commands')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('info')
                .setDescription('Information über den Bot'),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('ping')
                .setDescription("Ping Command"),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('embed')
                .setDescription('Embed erstellen')
                .addStringOption(option => option.setName('title').setDescription('Titel der Embed').setRequired(true))
                .addStringOption(option => option.setName('description').setDescription('Text in der Embed').setRequired(true))
                .addStringOption(option => option.setName('image').setDescription('Banner der Embed').setRequired(false))
                .addStringOption(option => option.setName('thumbnail').setDescription('Bild in der Embed').setRequired(false))
                .addStringOption(option => option.setName('field-name').setDescription('Feld Name in der Embed').setRequired(false))
                .addStringOption(option => option.setName('field-value').setDescription('Feld Text in der Embed').setRequired(false))
                .addStringOption(option => option.setName('footer').setDescription('Footer der Embed').setRequired(false)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('dm-user')
                .setDescription('Sende einem User eine DM')
                .addUserOption(option => option.setName('member').setDescription('Member welche Die DM erhalten soll').setRequired(true))
                .addStringOption(option => option.setName('message').setDescription('message welche der User per DM erhalten soll').setRequired(true)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('soon')
                .setDescription('Sendet Coming Soon message')
                .addRoleOption(option => option.setName('teamrole').setDescription('Teamrolle').setRequired(true)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('roleall')
                .setDescription('Füge allen Membern eine Rolle hinzu')
                .addRoleOption(option => option.setName('rolle').setDescription('rolle').setRequired(true)),
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        const { options } = interaction;

        if (subcommand === 'info') {

            const rolle = config.roles.team;

            const embed = new EmbedBuilder()
                .setDescription(`**__Information über den Bot__**`)
                .addFields(
                    { name: '__Ersteller:__', value: '*Berniiii*' },
                    { name: '__Version:__', value: '*' + config.bot.version + '*' },
                    { name: '__Interesse am Bot?__', value: '*-> dm <@903699006121734164> -> berniiii*' },
                )
                .setColor(config.settings.color)
                .setTimestamp()
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo })

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })

        } else if (subcommand === 'ping') {

            const message = await interaction.deferReply({
                fetchReply: true,
            });

            const newMessage = `API Latency: ${client.ws.ping}\nClient Ping: ${message.createTimestamp - interaction.createTimestamp
                }`;
            await interaction.editReply({
                content: newMessage,
            });

        } else if (subcommand === 'embed') {

            if (!(interaction.member.roles.cache.has(config.roles.admin) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))) return interaction.reply({ content: config.texte.invalidRole, ephemeral: true })

            const title = options.getString('title');
            const description = options.getString('description');
            const image = options.getString('image');
            const thumbnail = options.getString('thumbnail');
            const fieldn = options.getString('field-name') || ' ';
            const fieldv = options.getString('field-value') || ' ';
            const footer = options.getString('footer') || ' ';

            if (image) {
                if (!image.startsWith('http')) return await interaction.reply({ content: "Das ist kein Gültiges Bild", ephemeral: true })
            }

            if (thumbnail) {
                if (!thumbnail.startsWith('http')) return await interaction.reply({ content: "Das ist kein Gültiges Bild", ephemeral: true })
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
            await interaction.channel.send({ embeds: [embed] })

        } else if (subcommand === 'dm-user') {

            if (!(interaction.member.roles.cache.has(config.roles.admin) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))) return interaction.reply({ content: config.texte.invalidRole, ephemeral: true })

            const member = options.getMember('member');
            const message = options.getString('message');

            const dmEmbed = new EmbedBuilder()
                .setAuthor({ name: `DM von ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`${message}\n\n`)
                .setColor(config.settings.color)
                .setFooter({ text: `Gesendet von: ${interaction.guild.name}` })

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await member.send({ embeds: [dmEmbed] })

        } else if (subcommand === 'soon') {

            if (!(interaction.member.roles.cache.has(config.roles.admin) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))) return interaction.reply({ content: config.texte.invalidRole, ephemeral: true })

            const teamrole = options.getRole('teamrole');

            const embed = new EmbedBuilder()
                .setTitle('Coming Soon')
                .setDescription(`Ist in Arbeit! Es wird bald verfügbar sein\n\nMit Freundlich Grüßen\n${teamrole}`)
                .setColor(config.settings.color)
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo })

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })

        } else if (subcommand === 'roleall') {

            if (!(interaction.member.roles.cache.has(config.roles.admin) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))) return interaction.reply({ content: txtCnfg.allgemein.invalidRole, ephemeral: true })

            const rolle = options.getRole('rolle');

            const members = await interaction.guild.members.fetch();

            members.forEach(member => {
                if (!member.roles.cache.has(rolle.id)) {
                    member.roles.add(rolle).catch(console.error);
                }
            })

            const message = `Die Rolle ${rolle} wurde erfolgreich allen Mitgliedern hinzugefügt!`

            await interaction.reply({ content: message, ephemeral: true });

        }
    }
}