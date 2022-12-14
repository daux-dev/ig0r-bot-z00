const {SlashCommandBuilder, REST , Routes} = require("discord.js");
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
            .setDescription("Call dibs auf wo du schlafen willst!")
            .addChoices(
                {name: "couch", value: "couch"},
                {name: "smolcouch", value: "smolcouch"},
                {name: "bigcouch", value: "bigcouch"},
                {name: "matratze", value: "matratze"},
                {name: "feldbett1", value: "feldbett1"},
                {name: "feldbett2", value: "feldbett2"},
                {name: "feldbett3", value: "feldbett3"},
            )),
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

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