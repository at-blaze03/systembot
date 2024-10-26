const { EmbedBuilder } = require('discord.js')
const config = require('../config')

function welcomeHandler(client) {
    client.on('guildMemberAdd', (member) => {
        const welcomeChannel = member.guild.channels.cache.get(config.channels.welcome);
        
        if (welcomeChannel) {
            const memberCount = member.guild.members.cache.size;
        
            const welcomeEmbed = new EmbedBuilder()
                .setTitle('Willkommen!')
                .setDescription(`Herzlich Willkommen auf **__${member.guild.name}__**\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n`)
                .addFields({ name: "User:", value: `${member.user}`, inline: true })
                .addFields({ name: "Name:", value: `${member.user.tag}`, inline: true })
                .addFields({ name: "ID:", value: `${member.user.id}`, inline: true })
                .addFields({ name: " ", value: "\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n" })
                .addFields({ name: "Server Beigetreten", value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true })
                .addFields({ name: "Discord Beigetreten", value: `<t:${parseInt(member.user.createdAt / 1000)}:R>`, inline: true })
                .setThumbnail(member.user.displayAvatarURL())
                .setImage(config.bot.images.banner)
                .setColor(config.settings.color);
        
            const dmEmbed = new EmbedBuilder()
                .setTitle(`Willkommen auf ${member.guild.name}`)
                .setDescription(`Herzlich Willkommen auf **__${member.guild.name}__**\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n`)
                .addFields({ name: "User:", value: `${member.user}`, inline: true })
                .addFields({ name: "Name:", value: `${member.user.tag}`, inline: true })
                .addFields({ name: "ID:", value: `${member.user.id}`, inline: true })
                .addFields({ name: " ", value: "\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n" })
                .addFields({ name: "Server Beigetreten", value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true })
                .addFields({ name: "Discord Beigetreten", value: `<t:${parseInt(member.user.createdAt / 1000)}:R>`, inline: true })
                .setThumbnail(member.user.displayAvatarURL())
                .setImage(config.bot.images.banner)
                .setColor(config.settings.color);
        
            welcomeChannel.send({ embeds: [welcomeEmbed] });
            try {
                member.send({ embeds: [dmEmbed] });
            } catch(err) {
                console.log(err);
            }
        
            if (config.settings.autoJoinRole == "true") {
                member.roles.add(config.roles.autoJoinRole);
            }
        
            const accountAgeLimitInDays = config.settings.minAccountAge;
            const accountCreationDate = member.user.createdAt;
            const currentDate = new Date();
        
            const accountAgeInMs = currentDate - accountCreationDate;
            const accountAgeInDays = accountAgeInMs / (1000 * 60 * 60 * 24);
        
            if (accountAgeInDays < accountAgeLimitInDays) {
                if (config.settings.actionOnYoungAccount === "ban") {
                    member.ban({ days: 30, reason: `Account jünger als ${accountAgeLimitInDays} Tage.` })
                        .then(() => {
                            console.log(`${member.user.tag} wurde gebannt, weil der Account nur ${Math.floor(accountAgeInDays)} Tage alt ist.`);
                            welcomeChannel.send(`${member.user.tag} wurde für einen Monat gebannt, weil der Account zu jung ist (${Math.floor(accountAgeInDays)} Tage alt).`);
                        })
                        .catch(err => {
                            console.error(`Fehler beim Bannen von ${member.user.tag}:`, err);
                        });
                } else if (config.settings.actionOnYoungAccount === "kick") {
                    member.kick(`Account jünger als ${accountAgeLimitInDays} Tage.`)
                        .then(() => {
                            console.log(`${member.user.tag} wurde gekickt, weil der Account nur ${Math.floor(accountAgeInDays)} Tage alt ist.`);
                            welcomeChannel.send(`${member.user.tag} wurde gekickt, weil der Account zu jung ist (${Math.floor(accountAgeInDays)} Tage alt).`);
                        })
                        .catch(err => {
                            console.error(`Fehler beim Kicken von ${member.user.tag}:`, err);
                        });
                }
            }
        }
    });
        
    client.on('guildMemberRemove', (member) => {
        const goodbyeChannel = member.guild.channels.cache.get(config.channels.goodbye);
        
        if (goodbyeChannel) {
            const memberCount = member.guild.members.cache.size;
        
            const goodbyeEmbed = new EmbedBuilder()
            .setTitle('Auf Wiedersehen!')
            .setDescription(`${member.user} hat **__${member.guild.name}__** verlassen!\n\nWir hoffen du hattest eine schöne Zeit auf **__${member.guild.name}__**!`)
            .addFields({ name: " ", value: "\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n" })
            .addFields({ name: "Name:", value: `${member.user.tag}` })
            .setThumbnail(member.user.displayAvatarURL())
            .setImage(config.bot.images.banner)
            .setColor(config.settings.color)
        
            goodbyeChannel.send({ embeds: [goodbyeEmbed] });
        }
    });

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isButton()) return;
        if (interaction.customId === "insgesamtebooster") {
          await interaction.deferReply({ ephemeral: true });
          const totalBoosters =
            (await interaction.guild.members.fetch())
              .filter((member) =>
                member.roles.cache.has(
                  interaction.guild.roles.premiumSubscriberRole?.id
                )
              )
              .map(
                (member) =>
                  `- ${member} | ${
                    member.user.username
                  } | Letzter Boost am: <t:${Math.round(
                    member.premiumSinceTimestamp / 1000
                  )}:D>`
              )
              .join("\n") || "❌ No booster was found for this server!";
      
          const totalBoosterEmbed = new EmbedBuilder()
            .setAuthor({
              name: `Alle Booster von ${interaction.guild.name} [${
                interaction.guild.roles.premiumSubscriberRole?.members.size ?? 0
              }]`,
              iconURL: interaction.guild.iconURL({ size: 1024 }),
            })
      
            .setDescription(totalBoosters.length > 4096 ? totalBoosters.slice(0, 4093) + "..." : totalBoosters)
            .setColor(config.settings.color)
            .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo })
            .setTimestamp();
          interaction.editReply({ embeds: [totalBoosterEmbed] });
        }
      });
}

module.exports = { welcomeHandler }