const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`sadasasd`);
	},
};

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log("\x1b[32m Bot ist Online! \x1b[0m")
    }
}