const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const config = require('../config')

function boostHandler(client) {
    // Boosts
client.on("guildMemberUpdate", async (oldMember, newMember) => {
    const boostLog = client.channels.cache.get(
      config.channels.boostLog
    );
    const boost = client.channels.cache.get(
      config.channels.boost
    );
    const format = {
      0: "Kein Level",
      1: "Level 1",
      2: "Level 2",
      3: "Level 3",
    };
    const boostLevel = format[newMember.guild.premiumTier];
    const totalBoosterRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("insgesamtebooster")
        .setLabel("Insgesamte Booster")
        .setEmoji(config.icons.boostemoji)
        .setStyle(ButtonStyle.Primary)
    );
    if (
      !oldMember.roles.cache.has(
        newMember.guild.roles.premiumSubscriberRole?.id
      ) &&
      newMember.roles.cache.has(newMember.guild.roles.premiumSubscriberRole?.id)
    ) {
      const boostAnnounceEmbed = new EmbedBuilder()
        .setAuthor({
          name: `Danke, wir haben einen neuen Booster!`,
          iconURL: newMember.guild.iconURL({ size: 1024 }),
        })
        .setDescription(`>>> Lieber ${newMember}, Vielen Dank für deinen Boost!\nGenieße deine neue ${newMember.guild.roles.premiumSubscriberRole} Rolle.`)
        .addFields({
          name: "💎 Insgesamte Boosts:",
          value: `${newMember.guild.premiumSubscriptionCount} Boosts | Community (${boostLevel})`,
          inline: false,
        })
        .setImage(config.bot.images.banner)
        .setColor(config.settings.color)
        .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo })
        .setTimestamp();
      
        const boostAnnounceRow = new ActionRowBuilder().addComponents(
        totalBoosterRow.components[0],
        new ButtonBuilder()
          .setLabel(`${newMember.user.username}`)
          .setEmoji(config.icons.boostemoji)
          .setCustomId("Disabled")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true)
      );
      const msg = await boost.send({
        content: `${newMember} \`${newMember}\``,
        embeds: [boostAnnounceEmbed],
        components: [boostAnnounceRow],
      });
      msg.react(config.icons.boostemoji);
  
      await newMember
        .send({
          embeds: [
            new EmbedBuilder()
              .setDescription(`- Hallo ${newMember}, Vielen Dank fürs Boosten von **__${newMember.guild.name}__**!\n- Vergess nicht du hast nun auch die neue Rolle **${newMember.guild.roles.premiumSubscriberRole?.name}** 🎉`)
              .setColor(config.settings.color)
              .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo })
              .setTimestamp(),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Zur Boost Nachricht")
                .setStyle(ButtonStyle.Link)
                .setURL(msg.url)
            ),
          ],
        })
        .catch((err) => {
          console.error(
            `An error ocurred while sending DM to new booster:\n-> ${chalk.red(
              err
            )}`
          );
        });
  
      const boostLogEmbed = new EmbedBuilder()
        .setAuthor({
          name: `Neuer Boost Log`,
          iconURL: client.user.displayAvatarURL(),
        })
        .addFields(
          {
            name: "💎 Nitro Booster",
            value: `${newMember.user} (${newMember.user.username})`,
          },
          {
            name: "🎉 Server geboostet am",
            value: `<t:${Math.round(
              newMember.premiumSinceTimestamp / 1000
            )}:D> (<t:${Math.round(newMember.premiumSinceTimestamp / 1000)}:R>)`,
            inline: true,
          },
          {
            name: "⏰ Account erstellt am",
            value: `<t:${Math.round(
              newMember.user.createdTimestamp / 1000
            )}:D> (<t:${Math.round(newMember.user.createdTimestamp / 1000)}:R>)`,
            inline: true,
          },
          {
            name: "📆 Server Beigetreten am",
            value: `<t:${Math.round(
              newMember.joinedTimestamp / 1000
            )}:D> (<t:${Math.round(newMember.joinedTimestamp / 1000)}:R>)`,
            inline: true,
          },
          {
            name: "💜 Insgesamte Boosts",
            value: `${newMember.guild.premiumSubscriptionCount} Boost | Community (${boostLevel})`,
            inline: false,
          },
          {
            name: "✅ Gegebene Rolle",
            value: `${newMember.guild.roles.premiumSubscriberRole} (${newMember.guild.roles.premiumSubscriberRole?.id})`,
            inline: false,
          }
        )
        .setThumbnail(newMember.user.displayAvatarURL({ size: 1024 }))
        .setColor(config.settings.color)
        .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo })
        .setTimestamp();
      boostLog.send({ embeds: [boostLogEmbed] });
    }
  
    if (
      oldMember.roles.cache.has(
        newMember.guild.roles.premiumSubscriberRole?.id
      ) &&
      !newMember.roles.cache.has(newMember.guild.roles.premiumSubscriberRole?.id)
    ) {
      await oldMember
        .send({
          embeds: [
            new EmbedBuilder()
              .setDescription(`Hallo ${oldMember}, leider bist du kein Booster mehr bei **__${oldMember.guild.name}__**, allerdings kannst du gerne jederzeit wieder bei uns boosten, wir würden uns freuen!`)
              .setColor(config.settings.color)
              .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo })
              .setTimestamp(),
          ],
        })
        .catch((err) => {
          console.error(
            `An error ocurred while sending DM to the member who has unboost the server:\n-> ${chalk.red(
              err
            )}`
          );
        });
      const unboostEmbedLog = new EmbedBuilder()
        .setAuthor({
          name: `Neuer Unboost Log`,
          iconURL: client.user.displayAvatarURL(),
        })
        .addFields(
          {
            name: "📌 UnBooster",
            value: `${oldMember.user} (${oldMember.user.username})`,
          },
          {
            name: "⏰ Account erstellt am",
            value: `<t:${Math.round(
              oldMember.user.createdTimestamp / 1000
            )}:D> (<t:${Math.round(oldMember.user.createdTimestamp / 1000)}:R>)`,
            inline: true,
          },
          {
            name: "📆 Server Beigetreten am",
            value: `<t:${Math.round(
              oldMember.joinedTimestamp / 1000
            )}:D> (<t:${Math.round(oldMember.joinedTimestamp / 1000)}:R>)`,
            inline: true,
          },
  
          {
            name: "💜 Insgesamte Boosts",
            value: oldMember.guild.premiumSubscriptionCount
              ? `${oldMember.guild.premiumSubscriptionCount} Boosts | Community (${boostLevel})`
              : "Keiner hat den Server geboostet",
            inline: false,
          },
  
          {
            name: "❌ Entfernte Rolle",
            value: `${oldMember.guild.roles.premiumSubscriberRole}  (${oldMember.guild.roles.premiumSubscriberRole?.id})`,
            inline: false,
          }
        )
        .setThumbnail(oldMember.user.displayAvatarURL({ size: 1024 }))
        .setColor(config.settings.color)
        .setFooter({ text: config.texte.footer, iconURL: config.bot.images.logo })
        .setTimestamp();
        
        const unboostLogMessage = await boostLog.send({
        embeds: [unboostEmbedLog],
        components: oldMember.guild.premiumSubscriptionCount
          ? [totalBoosterRow]
          : [],
      });
      unboostLogMessage.pin();
    }
  });
}

module.exports = { boostHandler };