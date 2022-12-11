const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require("dotenv").config();

const commands = [
	new SlashCommandBuilder().setName('dojo').setDescription('Informationen und Teilnehmerliste zum kommenden Event!'),
    new SlashCommandBuilder().setName('unattend').setDescription('Vom aktuellen Event abmelden!'),
    new SlashCommandBuilder().setName('undibs').setDescription('Dibs auf Schlafplatz widerrufen.'),
    new SlashCommandBuilder().setName('events').setDescription('Listet die nächsten 4 geplanten Events.'),
    new SlashCommandBuilder().setName('links').setDescription('Nützliche Links.'),
	new SlashCommandBuilder()
    .setName('attend')
    .setDescription('Anmeldung zum kommenden Event! Optional mit dibs auf Schlafplatz.')
    .addStringOption(option =>
        option.setName("dibs")
            .setDescription("Call dibs auf wo du pennen willst!")
            .setRequired(false)
            .addChoice("couch", "couch")
            .addChoice("smolcouch", "smolcouch")
            .addChoice("bigcouch", "bigcouch")
            .addChoice("matratze", "matratze")
            .addChoice("feldbett1", "feldbett1")
            .addChoice("feldbett2", "feldbett2")
            .addChoice("feldbett3", "feldbett3")
            ),
	// new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();