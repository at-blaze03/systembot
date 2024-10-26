require('dotenv').config();
const { ActivityType } = require("discord.js");

const config = {
    bot: {
        token: process.env.BOT_TOKEN,
        images: {
            logo: "https://berniiii.isfucking.pro/A1w3VG.png", // Logo des Bots
            banner: "https://berniiii.isfucking.pro/g7mfGF.png" // Banner des Bots
        },
        guildId: process.env.GUILD_ID, // ID des Servers
        version: '2.1.0' // Bot-Version
    },
    statuses: [ // Verfügbar: Playing, Streaming, Listening, Watching, Competing
        {
            name: "Berniiii",
            type: ActivityType.Listening // Aktive Statusart
        },
        {
            name: "B Bots",
            type: ActivityType.Watching // Aktive Statusart
        },
        {
            name: "VS Code",
            type: ActivityType.Competing  // Aktive Statusart
        }
    ],
    roles: {
        admin: "adminRoleId", // Rolle für Administratoren
        fraktionsverwaltung: "fraktionsverwaltungRoleId", // Rolle für Fraktionsverwaltung
        teamverwaltung: "teamverwaltungRoleId", // Rolle für Teamverwaltung
        team: "teamRoleId", // Rolle für Teammitglieder
        verify: "verifyRoleId", // Rolle für Verifizierung
        autoJoinRole: "autoJoinRoleId" // Automatische Beitrittsrollen ID
    },
    icons: {
        umfrage1: "✅", // Emoji für Umfrage 1
        umfrage2: "❎", // Emoji für Umfrage 2
        boostemoji: "💜", // Emoji für Booster
        ticketClose: "🗑️", // Emoji für Ticket schließen
        ticketweitergeben: "❎", // Emoji für Ticket weitergeben
        transcript: "📝", // Emoji für Transkripte
        claim: "✅", // Emoji für Claim
        yes: "✅",
        no: "❎"
    },
    settings: {
        color: "#000001", // Hauptfarbe des Bots (für Embeds)
        supportPing: "true", // Support Ping aktivieren
        selfverify: "true", // Selbstverifizierung aktivieren
        autoJoinRole: "true", // Ob der User automatisch eine Rolle beim Joinen bekommt
        minAccountAge: 7, // Minimales Kontoalter in Tagen
        actionOnYoungAccount: "kick" // Aktion bei jungen Konten: "ban" oder "kick"
    },
    ticket: {
        support: {
            name: "Support Ticket", // Name des Support-Tickets
            desc: "Erstelle ein Support Ticket", // Beschreibung des Support-Tickets
            channelName: "support", // Kanalname für Support
            categoryId: "supportCategoryId", // ID für die Support-Kategorie
            role: "supportRoleId", // Rolle für Support
            icon: "📂" // Emoji für Support
        },
        feedback: {
            name: "Feedback Ticket",
            desc: "Erstelle ein Feedback Ticket",
            channelName: "feedback",
            categoryId: "feedbackCategoryId",
            role: "feedbackRoleId",
            icon: "📂"
        },
        bugreport: {
            name: "Bug Report Ticket",
            desc: "Erstelle ein Bug Report Ticket",
            channelName: "bug-report",
            categoryId: "bugReportCategoryId",
            role: "bugReportRoleId",
            icon: "📂"
        }
    },
    reactionRoles: {
        roles: {
            role1: {
                name: "roleName1", // Name der Rolle 1
                desc: "Wähle die Rolle, um ...", // Beschreibung der Rolle 1
                id: "reactionRole1Id", // ID der Rolle 1
                emoji: "🤝" // Emoji für Rolle 1
            },
            role2: {
                name: "roleName2",
                desc: "Wähle die Rolle, um ...",
                id: "reactionRole2Id",
                emoji: "🤝"
            },
            role3: {
                name: "roleName3",
                desc: "Wähle die Rolle, um ...",
                id: "reactionRole3Id",
                emoji: "🤝"
            }
        },
    },
    texte: {
        footer: "© B Bots", // Fußzeile für den Bot
        invalidRole: "Du kannst diesen Command nicht nutzen", // Nachricht bei ungültiger Rolle
        successSentMessage: "Nachricht wurde gesendet", // Bestätigung, dass die Nachricht gesendet wurde
        verifyMsg: "Du bist nun erfolgreich Verifiziert!" // Nachricht bei erfolgreicher Verifizierung
    },
    channels: {
        // Welcome
        welcome: "welcomeChannelId", // Kanal-ID für Begrüßung
        goodbye: "goodbyeChannelId", // Kanal-ID für Verabschiedung
        // Boost
        boost: "boostChannelId", // Kanal-ID für Boost-Nachrichten
        boostLog: "boostLogChannelId", // Kanal-ID für Boost-Logs
        // Support Ping
        supportVoice: "supportVoiceChannelId", // Kanal-ID für Sprachunterstützung
        supportMessage: "supportMessageChannelId", // Kanal-ID für Support-Nachrichten
        // Feedback
        feedbackChannel: "feedbackChannelId", // Kanal-ID für Feedback
        // Stats
        memberstats: "👥︱Users:", // Name des Stat-Kanals
        // Ticket
        ticketLog: "ticketLogChannelId", // Kanal-ID für Ticket-Logs
        newTicketChannel: "newTicketChannelId" // Kanal-ID für neue Tickets
    }
};

module.exports = config;