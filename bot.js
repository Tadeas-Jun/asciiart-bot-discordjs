const { Client } = require('discord.js');
const client = new Client({ intents: [] });
const { token } = require('./resources/config.json');

const commandTemplate = require('./resources/command_template.json');
const artList = require('./resources/art.json');

console.log('Starting bot, please give me a second.');
client.on('ready', async () => {

    client.user.setActivity('you be awesome (☞ﾟヮﾟ)☞', {type: "WATCHING"});

    await CreateCommands();

    console.log('I am ready to send some ASCII art!');

});

async function CreateCommands() {

    console.log('Creating commands.');

    let commandData = [];

    // Loops through the art.json file, creating a new command based on the commandTeplate.json file for each one.
    let i = 1;
    artList.forEach(artObject => {

        console.log(`${i}. Creating a command for: \'${artObject.name}\'.`);
        let command = {...commandTemplate}; // Copying the command template into a new variable.
        command.name = artObject.name;
        command.description = command.description.replace('[art]', artObject.art);
        commandData.push(command);
        i++;
    });

    console.log(`Deploying ${commandData.length} commands.`);

    // Deploying commands for all guilds (might take up to an hour to load everywhere).
    await client.application?.commands.set(commandData);

    // Deploy the commands to a specific guild, for testing purposes - the global commands take up to an hour to load, the guild commands are instant.
    //await client.guilds.cache.get('GUILD_ID')?.commands.set(commandData);

}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    // Find the art in art.json based on the command the user used.
    const asciiArt = artList.find(art => art.name === interaction.commandName);
    if(!isAsciiArtValid(asciiArt)) return;

    // Get the message the user added, if any.
    let message = interaction.options.getString('message');

    // If the user added a message, append the art to the end of said message. Otherwise just send the art.
    const replyString = message === null ? asciiArt.art : message + ' ' + asciiArt.art;

    console.log(`Sending \'${asciiArt.name}\'.`);
    interaction.reply(replyString);

});

// Does the art from art.json have all the necessary info?
function isAsciiArtValid(artObject) {

    const valid = (artObject.art !== null && artObject.art.trim().length !== 0) &&
        (artObject.name !== null && artObject.name.trim().length !== 0);

        return valid;

}

client.login(token);