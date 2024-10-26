const { Events } = require('discord.js');
const config = require('../config')

function roleHandler(client) {
    
    ////////// VERIFY ROLES \\\\\\\\\\

    client.on(Events.InteractionCreate, async interaction => {
        if (interaction.customId == 'dropRole') {
            const member = interaction.member;
        
            if (member.roles.cache.has(config.roles.verify)) {
            await interaction.reply({ content: 'Rolle bereits vorhanden', ephemeral: true });
            } else {
            try {
                await member.roles.add(config.roles.verify);
                await interaction.reply({ content: 'Role added!', ephemeral: true });
            } catch (err) {
                console.log(err);
            }
            }
        }
    })

    
    ////////// REACTION ROLES \\\\\\\\\\
    
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isStringSelectMenu()) return;
    
        const member = interaction.member;
        const selectedRoleValue = interaction.values[0];
    
        const roleMap = {};
        for (const [key, role] of Object.entries(config.reactionRoles.roles)) {
            roleMap[`r-${key}`] = role;
        }
    
        const roleId = roleMap[selectedRoleValue];
        if (!roleId) return;
    
        try {
            if (member.roles.cache.has(roleId)) {
                await member.roles.remove(roleId);
                await interaction.reply({ content: 'Rolle entfernt', ephemeral: true });
            } else {
                await member.roles.add(roleId);
                await interaction.reply({ content: 'Rolle hinzugefügt!', ephemeral: true });
            }
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: 'Ein Fehler ist aufgetreten.', ephemeral: true });
        }
    });
    
}

module.exports = { roleHandler }