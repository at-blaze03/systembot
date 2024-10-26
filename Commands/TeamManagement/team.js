const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

const config = require("../../config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('team')
        .setDescription('Team Commands')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('join')
                .setDescription('Jemand tritt dem Team bei')
                .addUserOption(option => option.setName('teamler').setDescription('Der User der das Team betritt').setRequired(true))
                .addRoleOption(option => option.setName('role').setDescription('User Rolle').setRequired(true))
                .addRoleOption(option => option.setName('teamrole').setDescription('Deine Rolle').setRequired(true)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('uprank')
                .setDescription('Jemand bekommt einen Team uprank')
                .addUserOption(option => option.setName('teamler').setDescription('Der User der den Uprank erhaltet').setRequired(true))
                .addRoleOption(option => option.setName('newrole').setDescription('Neue Rolle').setRequired(true))
                .addRoleOption(option => option.setName('oldrole').setDescription('Alte Rolle').setRequired(true))
                .addStringOption(option => option.setName('grund').setDescription('Grund des Downranks').setRequired(true))
                .addRoleOption(option => option.setName('teamrole').setDescription('Deine Rolle').setRequired(true)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('warn')
                .setDescription('Jemand bekommt einen Team warn')
                .addUserOption(option => option.setName('teamler').setDescription('Der User der den Teamwarn erhaltet').setRequired(true))
                .addStringOption(option => option.setName('anzahl').setDescription('Anzahl der Teamwarns').setRequired(true))
                .addStringOption(option => option.setName('grund').setDescription('grund des Teamwarns').setRequired(true))
                .addRoleOption(option => option.setName('teamrole').setDescription('Deine Rolle').setRequired(true)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('downrank')
                .setDescription('Jemand bekommt einen Team downrank')
                .addUserOption(option => option.setName('teamler').setDescription('Der User der den Uprank erhaltet').setRequired(true))
                .addRoleOption(option => option.setName('newrole').setDescription('Neue Rolle').setRequired(true))
                .addRoleOption(option => option.setName('oldrole').setDescription('Alte Rolle').setRequired(true))
                .addStringOption(option => option.setName('grund').setDescription('Grund des Downranks').setRequired(true))
                .addRoleOption(option => option.setName('teamrole').setDescription('Deine Rolle').setRequired(true)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('kick')
                .setDescription('Jemand verlasst das Team')
                .addUserOption(option => option.setName('teamler').setDescription('Der User der das Team verlasst').setRequired(true))
                .addStringOption(option => option.setName('grund').setDescription('Grund des Teamkicks').setRequired(true))
                .addRoleOption(option => option.setName('teamrole').setDescription('Deine Rolle').setRequired(true)),
        ),

    async execute (interaction) {
        const subcommand = interaction.options.getSubcommand();

        const { options } = interaction;

        if (!(interaction.member.roles.cache.has(config.roles.teamverwaltung) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))) return interaction.reply({ content: config.texte.invalidRole, ephemeral: true})

        if (subcommand === 'join') {

            const teamler = options.getUser('teamler');
            const role = options.getRole('role');
            const teamrole = options.getRole('teamrole');

            const embed = new EmbedBuilder()
                .setTitle('Team Join')
                .setDescription(`Hiermit unterstützt ${teamler} das Team als ${role} !\n\n**Wir wünschen dir viel Spaß im Team**\n\n__Mit freundlichen Grüßen__\n${teamrole}`)
                .setColor(config.settings.color)
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo})

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })

        } else if (subcommand === 'uprank') {

            const teamler = options.getUser('teamler');
            const newrole = options.getRole('newrole');
            const oldrole = options.getRole('oldrole');
            const grund = options.getString('grund');
            const teamrole = options.getRole('teamrole');

            const embed = new EmbedBuilder()
                .setTitle('Team Uprank')
                .setDescription(`Hiermit erhält ${teamler} einen **__Uprank__** von **${oldrole}** auf **${newrole}**! \n\n Grund: ${grund} \n\n__Mit freundlichen Grüßen__\n${teamrole}`)
                .setColor(config.settings.color)
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo})

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })
            
        } else if (subcommand === 'warn') {

            const teamler = options.getUser('teamler');
            const anzahl = options.getString('anzahl');
            const grund = options.getString('grund');
            const teamrole = options.getRole('teamrole');

            const embed = new EmbedBuilder()
                .setTitle('Team Warn')
                .setDescription(`Hiermit erhält ${teamler} seinen **${anzahl} Teamwarn** !\n\n**Grund:** *${grund}* \n\n__Mit freundlichen Grüßen__\n${teamrole}`)
                .setColor(config.settings.color)
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo})

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })

        } else if (subcommand === 'downrank') {

            const teamler = options.getUser('teamler');
            const newrole = options.getRole('newrole');
            const oldrole = options.getRole('oldrole');
            const grund = options.getString('grund');
            const teamrole = options.getRole('teamrole');

            const embed = new EmbedBuilder()
                .setTitle('Team Downrank')
                .setDescription(`Hiermit erhält ${teamler} einen **__Downrank__** von **${oldrole}** auf **${newrole}**! \n\n Grund: ${grund} \n\n__Mit freundlichen Grüßen__\n${teamrole}`)
                .setColor(config.settings.color)
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo})

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })

        } else if (subcommand === 'kick') {

            const teamler = options.getUser('teamler');
            const grund = options.getString('grund');
            const teamrole = options.getRole('teamrole');

            const embed = new EmbedBuilder()
                .setTitle('Team Kick')
                .setDescription(`Hiermit verlasst ${teamler} das Team !\n\nGrund: ${grund}\n\n**Wir wünschen dir eine schöne Zeit und Danken für deinen Einsatz**\n\n__Mit freundlichen Grüßen__\n${teamrole}`)
                .setColor(config.settings.color)
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo})

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })
            
        }
    }
}