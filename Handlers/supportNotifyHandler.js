const config = require('../config')

function loadSupportNotify(client) {
    if (config.settings.selfverify != "true") {
        console.log('\x1b[31m Self-Verify ist deaktiviert \x1b[0m ')
    } else {
        console.log('\x1b[32m Self-Verify ist aktiviert \x1b[0m ')
    }
    
    if (config.settings.supportPing == "true") {
        console.log('\x1b[32m Support Benachrichtigung aktiviert \x1b[0m ')
        client.on('voiceStateUpdate', (oldState, newState) => {
            if (
                newState.member.user.bot ||
                !newState.channel ||
                newState.channelId !== config.channels.supportVoice
            ) {
                return;
            }
        
            const textChannel = newState.guild.channels.cache.get(config.channels.supportMessage);
            if (textChannel) {
                textChannel.send('<@&' + config.roles.team + '>');
                const voiceMessage = new EmbedBuilder()
                    .setDescription(`${newState.member} hat den Voice-Support betreten!`)
                    .setColor(config.settings.color)
                textChannel.send({ embeds: [voiceMessage] });
            }
        });
    } else {
        console.log('\x1b[31m Support Benachrichtigung deaktiviert \x1b[0m ')
    }
}

module.exports = { loadSupportNotify }