const { Client } = require('discord.js');
const client = new Client({ intents: [] });
const { token } = require('./resources/config.json');

const commandTemplate = require('./resources/command_template.json');
const artList = require('./resources/art.json');

console.log('Starting bot, please give me a second.');
client.on('ready', () => {

    console.log('I am ready to send some ASCII art!');

    client.user.setActivity('you be awesome (☞ﾟヮﾟ)☞', {type: "WATCHING"});

    CreateCommands();

});

async function CreateCommands() {

    console.log('Creating commands.');

    let commandData = [];

    let i = 1;
    artList.forEach(artObject => {

        console.log(`${i}. Creating a command for: \'${artObject.name}\'.`);
        let command = {...commandTemplate};
        command.name = artObject.name;
        command.description = command.description.replace('[art]', artObject.art);
        commandData.push(command);
        i++;

    });

    console.log(`Deploying ${commandData.length} commands.`);

    await client.guilds.cache.get('434786513688199169')?.commands.set(commandData);

}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const asciiArt = artList.find(art => art.name === interaction.commandName);
    if(!isAsciiArtValid(asciiArt)) return;

    let message = interaction.options.getString('message');

    const replyString = message === null ? asciiArt.art : message + ' ' + asciiArt.art;

    console.log(`Sending \'${asciiArt.name}\'.`);
    interaction.reply(replyString);

});

function isAsciiArtValid(artObject) {

    const valid = (artObject.art !== null && artObject.art.trim().length !== 0) &&
        (artObject.name !== null && artObject.name.trim().length !== 0);

        return valid;

}

client.login(token);