/*const { ApplicationCommandNumericOptionMinMaxValueMixin} = require("discord.js");
const { eventNames } = require("process");*/

function loadEvents(client) {
    const ascii = require("ascii-table");
    const fs = require("fs");
    const table = new ascii().setHeading('Events', 'Status');

    const folders = fs.readdirSync('./Events')
    for ( const folder of folders) {
        const files = fs.readdirSync(`./Events/${folder}`).filter((file) => file.endsWith(".js"));

        for (const file of files) {
            const event = require(`../Events/${folder}/${file}`);

            if(event.rest) {
                if(event.once)
                client.rest.once(event.name, (...args) =>
                event.execute(...args, client)
                )
                else
                client.rest.on(event.name, (...args) => 
                event.execute(...args, client)
                )
            } else {
                if (event.once)
                client.once(event.name, (...args) => event.execute(...args, client))
                else client.on(event.name, (...args) => event.execute(...args, client))
            }
            table.addRow(file, "geladen")
            continue;
        }
    }
    return console.log(table.toString(), "\n \x1b[36m Events geladen \x1b[0m")
}

module.exports = {loadEvents};