const { Client, GatewayIntentBits, Partials, Collection, PermissionFlagsBits, PermissionsBitField } = require("discord.js");

const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;

const AntiSpam = require("discord-anti-spam");

const { loadEvents } = require('./Handlers/eventHandler');
const { loadCommands } = require('./Handlers/commandHandler');
const { ticketHandler } = require('./Handlers/ticketHandler');
const { welcomeHandler } = require('./Handlers/welcomeHandler');
const { boostHandler } = require('./Handlers/boostHandler');
const { roleHandler } = require('./Handlers/roleHandler');
const { loadSupportNotify } = require('./Handlers/supportNotifyHandler.js')

const config = require("./config.js");

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates],
  partials: [User, Message, Channel, GuildMember, ThreadMember],
});

const { ActivityType } = require("discord.js");


client.once('ready', async () => {
  console.log(`\x1b[34m Version: ${config.bot.version} \x1b[0m`);
  console.log(`\x1b[31m Logged in as ${client.user.tag}! \x1b[0m`);

  const guildId = config.bot.guildId;
  console.log(`Config Guild-ID: ${guildId}`);

  let guild = client.guilds.cache.get(guildId);
  if (!guild) {
      console.error('Server nicht gefunden im Cache. Versuche es mit fetch...');
      try {
          guild = await client.guilds.fetch(guildId);
          if (!guild) {
              return console.error('Server nicht gefunden nach fetch.');
          }
          console.log(`Guild gefunden nach fetch: ${guild.name}`);
      } catch (error) {
          return console.error('Fehler beim Abrufen des Servers:', error);
      }
  } else {
      console.log(`Guild gefunden: ${guild.name}`);
  }

    /// Stats
    let statsChannel = guild.channels.cache.find(channel => channel.name.startsWith(config.channels.memberstats));
    
    if (!statsChannel) {
        statsChannel = await guild.channels.create({
            name: `${config.channels.memberstats} ${guild.memberCount}`,
            type: 2,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionsBitField.Flags.Connect],
                },
            ],
        });
        console.log('Stats-Kanal erstellt.');
    }

    setInterval(() => {
        const memberCount = guild.memberCount;
        statsChannel.setName(`${config.channels.memberstats} ${memberCount}`)
            .catch(console.error);
    }, 300000);

    // Status
    const statuses = config.statuses.map(status => {
        return {
            name: status.name,
            type: status.type,
            url: status.url || undefined
        };
    });

    setInterval(() => {
        let random = Math.floor(Math.random() * statuses.length);

        client.user.setActivity({
            name: statuses[random].name,
            type: statuses[random].type,
            url: statuses[random].url
        });
    }, 10000);
});

if (config.settings.autoJoinRole != "true") {
  console.log('\x1b[31m AutoRole by Join ist deaktiviert \x1b[0m ')
} else {
  console.log('\x1b[32m AutoRole by Join ist aktiviert \x1b[0m ')
}

////////// A N T I   S P A M \\\\\\\\\\

const antiSpam = new AntiSpam({
  warnThreshold: 3,
  muteTreshold: 6,
  kickTreshold: 9,
  banTreshold: 12,
  warnMessage: "Stop spamming!",
  muteMessage: "Du wurdest getimeouted für spamming",
  kickMessage: "Du wurdest wegen spamming gekickt!",
  banMessage: "Du wurdest wegen spamming gebannt",
  unMuteTime: 1,
  verbose: true,
  removeMessages: true,
  ignoredPermissions: [PermissionFlagsBits.Administrator],
});

client.on("messageCreate", (message) => antiSpam.message(message));

client.commands = new Collection();
client.config = require("./config.js");

client.login(client.config.bot.token).then(() => {
  loadEvents(client);
  loadCommands(client);
  ticketHandler(client);
  welcomeHandler(client);
  boostHandler(client);
  roleHandler(client);
  loadSupportNotify(client);
})