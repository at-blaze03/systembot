const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require("discord.js");

const config = require("../../config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod')
        .setDescription('Moderation Commands')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('ban')
                .setDescription('Banne einen User')
                .addUserOption(option => option.setName("user").setDescription("User, welcher gebannt werden soll.").setRequired(true))
                .addStringOption(option => option.setName("grund").setDescription("Grund für den Bann.").setRequired(false)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('clear')
                .setDescription("Lösche Nachrichten")
                .addIntegerOption(option => option.setName("anzahl").setDescription("Anzahl der zu löschenden Nachrichten.").setMinValue(1).setMaxValue(99).setRequired(true))
                .addUserOption(option => option.setName("user").setDescription("Wähle einen Nutzer, dessen Nachrichten gelöscht werden sollen.").setRequired(false)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('kick')
                .setDescription("Kicke einen User")
                .addUserOption(option => option.setName("user").setDescription("User, welcher gekickt werden soll.").setRequired(true))
                .addStringOption(option => option.setName("grund").setDescription("Grund für den Kick").setRequired(false)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('timeout')
                .setDescription("Timeoute einen User")
                .addUserOption(option => option.setName("user").setDescription("User, welcher getimeoutet werden soll.").setRequired(true))
                .addStringOption(option => option.setName("time").setDescription("Zeit für den Timeout in S. Min. 60s").setRequired(true)),
        ),

    async execute (interaction) {
        const subcommand = interaction.options.getSubcommand();

        const {channel, options} = interaction;

        if (!(interaction.member.roles.cache.has(config.roles.admin) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))) return interaction.reply({ content: config.texte.invalidRole, ephemeral: true})

        if (subcommand === 'ban') {

            const user = options.getUser("user");
            const grund = options.getString("grund") || "Kein Grund angegeben.";

            const member = await interaction.guild.members.fetch(user.id);

            const errorEmbed = new EmbedBuilder()
                .setDescription(`Du kannst ${user.username} nicht bannen, da er eine höhere rolle besitzt`)
                .setColor(config.settings.color)

            if (member.roles.highest.position >= interaction.member.roles.highest.position)
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true})

            await member.ban({reason: `${grund}`})

            const successEmbed = new EmbedBuilder()
                .setDescription(`${user} erfolgreich gebannt. **Grund:** ${grund}`)
                .setColor(config.settings.color)

            await interaction.reply({embeds: [successEmbed]})

        } else if (subcommand === 'clear') {

            const anzahl = options.getInteger("anzahl");
            const target = options.getUser("user");

            const nachrichten = await channel.messages.fetch({
                limit: anzahl +1,
            });

            const embed = new EmbedBuilder()
                .setColor(config.settings.color)

            if(target) {
                let i = 0;
                const filtered = [];
                i++;

                (await nachrichten).filter((msg) => {
                    if(msg.author.id === target.id && anzahl > 1) {
                        filtered.push(msg);
                        i++;
                    }
                });

                await channel.bulkDelete(filtered).then(nachrichten => {
                    embed.setDescription(`Erfolgreich ${nachrichten.size} Nachrichten von ${target} gelöscht`)
                    interaction.reply({ embeds: [embed] })
                })
            } else {
                await channel.bulkDelete(anzahl, true).then(nachrichten => {
                    embed.setDescription(`Erfolgreich ${nachrichten.size} Nachrichten aus dem Kanal gelöscht!`)
                    interaction.reply({ embeds: [embed] })
                })
            }

        } else if (subcommand === 'kick') {

            const user = options.getUser("user");
            const grund = options.getString("grund") || "Kein Grund angegeben.";

            const member = await interaction.guild.members.fetch(user.id);

            const errorEmbed = new EmbedBuilder()
                .setDescription(`Du kannst ${user.username} nicht kicken, da er eine höhere rolle besitzt`)
                .setColor(config.settings.color)

            if (member.roles.highest.position >= interaction.member.roles.highest.position)
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true})

            await member.kick()

            const successEmbed = new EmbedBuilder()
                .setDescription(`${user} erfolgreich gekickt. **Grund:** ${grund}`)
                .setColor(config.settings.color)

            await interaction.reply({embeds: [successEmbed]})

        } else if (subcommand === 'timeout') {

            const user = options.getUser("user");
            const time = options.getString("time");
            const time2 = time * 1000;

            const member = await interaction.guild.members.fetch(user.id);

            const errorEmbed = new EmbedBuilder()
                .setDescription(`Du kannst ${user} nicht timeouten, da er eine höhere rolle als du besitzt`)
                .setColor(config.settings.color)

            if (member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ embeds: [errorEmbed], ephemeral: true})

            await member.timeout(time2)

            const t_time = time / 60;

            const successEmbed = new EmbedBuilder()
                .setDescription(`${user} wurde getimeoutet.\n**Zeit:** ${t_time} Minuten`)
                .setColor(config.settings.color)

            await interaction.reply({embeds: [successEmbed]})

        }
    }
}