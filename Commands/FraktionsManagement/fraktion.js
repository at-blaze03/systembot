const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

const config = require("../../config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fraktion')
        .setDescription('Fraktion Commands')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('offiziell')
                .setDescription('Frak welche Offiziell wird')
                .addStringOption(option => option.setName('neu').setDescription('Fraktion die Offiziell wird').setRequired(true))
                .addRoleOption(option => option.setName('teamrole').setDescription('Deine Rolle').setRequired(true)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('bündnis-offiziell')
                .setDescription('Ein Bündnis zweier Fraks wird eingegangen')
                .addStringOption(option => option.setName('name').setDescription('Name der 1.Fraktion').setRequired(true))
                .addStringOption(option => option.setName('name2').setDescription('Name der 2. Fraktion').setRequired(true))
                .addRoleOption(option => option.setName('teamrole').setDescription('Deine Rolle').setRequired(true)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('bündnis-auflösung')
                .setDescription('Ein Bündnis zweier Fraks wird aufgelöst')
                .addStringOption(option => option.setName('name').setDescription('Name der 1.Fraktion').setRequired(true))
                .addStringOption(option => option.setName('name2').setDescription('Name der 2. Fraktion').setRequired(true))
                .addRoleOption(option => option.setName('teamrole').setDescription('Deine Rolle').setRequired(true)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('warn')
                .setDescription('Frak welche einen Warn bekommt')
                .addStringOption(option => option.setName('name').setDescription('Name der Fraktion').setRequired(true))
                .addStringOption(option => option.setName('anzahl').setDescription('Anzahl der Frakwarns').setRequired(true))
                .addStringOption(option => option.setName('grund').setDescription('Grund des Fraktionswarns').setRequired(true))
                .addRoleOption(option => option.setName('teamrole').setDescription('Deine Rolle').setRequired(true)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('krieg')
                .setDescription('Frak welche einen Krieg beginnt')
                .addStringOption(option => option.setName('name').setDescription('Name der 1. Fraktion').setRequired(true))
                .addStringOption(option => option.setName('name2').setDescription('Name der 2. Fraktion').setRequired(true))
                .addRoleOption(option => option.setName('teamrole').setDescription('Deine Rolle').setRequired(true)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('waffenstillstand')
                .setDescription('Waffenstillstand zwischen zwei Fraks')
                .addStringOption(option => option.setName('name').setDescription('Name der 1. Fraktion').setRequired(true))
                .addStringOption(option => option.setName('name2').setDescription('Name der 2. Fraktion').setRequired(true))
                .addRoleOption(option => option.setName('teamrole').setDescription('Deine Rolle').setRequired(true)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('frieden')
                .setDescription('Frieden zwischen zwei Fraks')
                .addStringOption(option => option.setName('name').setDescription('Name der 1. Fraktion').setRequired(true))
                .addStringOption(option => option.setName('name2').setDescription('Name der 2. Fraktion').setRequired(true))
                .addRoleOption(option => option.setName('teamrole').setDescription('Deine Rolle').setRequired(true)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('krieg-gewinner')
                .setDescription('Gewinner des Fraktionkrieges')
                .addStringOption(option => option.setName('winner').setDescription('Gewinner des Krieges').setRequired(true))
                .addStringOption(option => option.setName('looser').setDescription('Verlierer des Krieges').setRequired(true))
                .addRoleOption(option => option.setName('teamrole').setDescription('Deine Rolle').setRequired(true)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('führung')
                .setDescription('Frak bekommt einen neuen Boss')
                .addUserOption(option => option.setName('neu').setDescription('Der User der die Frak übernimmt').setRequired(true))
                .addStringOption(option => option.setName('name').setDescription('Name der Fraktion').setRequired(true))
                .addRoleOption(option => option.setName('teamrole').setDescription('Deine Rolle').setRequired(true)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('auflösung')
                .setDescription('Frak welche Aufgelöst wird')
                .addStringOption(option => option.setName('name').setDescription('Name der Fraktion').setRequired(true))
                .addStringOption(option => option.setName('grund').setDescription('Grund der Auflösung').setRequired(true))
                .addRoleOption(option => option.setName('teamrole').setDescription('Deine Rolle').setRequired(true)),
        ),

    async execute (interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (!(interaction.member.roles.cache.has(config.roles.fraktionsverwaltung) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))) return interaction.reply({ content: config.texte.invalidRole, ephemeral: true})

        const { options } = interaction;

        if (subcommand === 'offiziell') {

            const neu = options.getString('neu');
            const teamrole = options.getRole('teamrole');

            const embed = new EmbedBuilder()
                .setTitle('Fraktion Offiziell')
                .setDescription(`Hiermit ist die Fraktion **__${neu}__** offiziell !\n\n__Mit freundlichen Grüßen__\n${teamrole}`)
                .setColor(config.settings.color)
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo})

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })

        } else if (subcommand === 'bündnis-offiziell') {

            const name = options.getString('name');
            const name2 = options.getString('name2');
            const teamrole = options.getRole('teamrole');

            const embed = new EmbedBuilder()
                .setTitle('Fraktions Bündnis')
                .setDescription(`Hiermit geht die Fraktion **__${name}__** mit **__${name2}__** ein Bündnis ein !\n\n__Mit freundlichen Grüßen__\n${teamrole}`)
                .setColor(config.settings.color)
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo})

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })

        } else if (subcommand === 'bündnis-auflösung') {

            const name = options.getString('name');
            const name2 = options.getString('name2');
            const teamrole = options.getRole('teamrole');

            const embed = new EmbedBuilder()
                .setTitle('Fraktions Bündnis Aufgelöst')
                .setDescription(`Hiermit löst sich das Bündnis der Fraktion **__${name}__** mit **__${name2}__** auf !\n\n__Mit freundlichen Grüßen__\n${teamrole}`)
                .setColor(config.settings.color)
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo})

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })

        } else if (subcommand === 'warn') {

            const name = options.getString('name');
            const anzahl = options.getString('anzahl');
            const grund = options.getString('grund');
            const teamrole = options.getRole('teamrole');

            const embed = new EmbedBuilder()
                .setTitle('Fraktions Warn')
                .setDescription(`Hiermit erhält die Fraktion **__${name}__** ihren **${anzahl} Fraktionswarn** !\n\n**Grund:** *${grund}* \n\n__Mit freundlichen Grüßen__\n${teamrole}`)
                .setColor(config.settings.color)
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo})

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })

        } else if (subcommand === 'krieg') {

            const name = options.getString('name');
            const name2 = options.getString('name2');
            const teamrole = options.getRole('teamrole');

            const embed = new EmbedBuilder()
                .setTitle('Fraktions Krieg')
                .setDescription(`Hiermit herrscht ein Fraktions-Krieg zwischen **__${name}__** und **__${name2}__**\n\n__Mit freundlichen Grüßen__\n${teamrole}`)
                .setColor(config.settings.color)
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo})

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })

        } else if (subcommand === 'waffenstillstand') {

            const name = options.getString('name');
            const name2 = options.getString('name2');
            const teamrole = options.getRole('teamrole');

            const embed = new EmbedBuilder()
                .setTitle('Fraktions Waffenstillstand')
                .setDescription(`Hiermit herrscht ein Waffenstillstand zwischen **__${name}__** und **__${name2}__**\n\n__Mit freundlichen Grüßen__\n${teamrole}`)
                .setColor(config.settings.color)
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo})

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })

        } else if (subcommand === 'frieden') {

            const name = options.getString('name');
            const name2 = options.getString('name2');
            const teamrole = options.getRole('teamrole');

            const embed = new EmbedBuilder()
                .setTitle('Fraktions Frieden')
                .setDescription(`Hiermit herrscht Frieden zwischen **__${name}__** und **__${name2}__**\n\n__Mit freundlichen Grüßen__\n${teamrole}`)
                .setColor(config.settings.color)
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo})

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })

        } else if (subcommand === 'krieg-gewinner') {

            const winner = options.getString('winner');
            const looser = options.getString('looser');
            const teamrole = options.getRole('teamrole');

            const embed = new EmbedBuilder()
                .setTitle('Fraktions Krieg Gewinner')
                .setDescription(`Hiermit gewinnt **__${winner}__** den Fraktions-Krieg gegen **__${looser}__**\n\n__Mit freundlichen Grüßen__\n${teamrole}`)
                .setColor(config.settings.color)
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo})

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })

        } else if (subcommand === 'führung') {
            const neu = options.getUser('neu');
            const name = options.getString('name');
            const teamrole = options.getRole('teamrole');

            const embed = new EmbedBuilder()
                .setTitle('Fraktions Leader Wechsel')
                .setDescription(`Hiermit übernimmt ${neu} die Fraktion **__${name}__** \n\n__Mit freundlichen Grüßen__\n${teamrole}`)
                .setColor(config.settings.color)
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo})

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })
        } else if (subcommand === 'auflösung') {

            const name = options.getString('name');
            const grund = options.getString('grund');
            const teamrole = options.getRole('teamrole');

            const embed = new EmbedBuilder()
                .setTitle('Fraktion Aufgelöst')
                .setDescription(`Hiermit wird die Fraktion **__${name}__** aufgelöst !\n\n**Grund:** *${grund}* \n\n__Mit freundlichen Grüßen__\n${teamrole}`)
                .setColor(config.settings.color)
                .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo})

            await interaction.reply({ content: config.texte.successSentMessage, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] })

        }
    }
}