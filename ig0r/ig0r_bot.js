const {Client, GatewayIntentBits, InteractionType} = require("discord.js");
require("dotenv").config();

const func = require("./functions/func");
const dojo = require("./interactions/dojo");
const attend = require("./interactions/attend");
const unattend = require("./interactions/unattend");
const undibs = require("./interactions/undibs");
const events = require("./interactions/events");
const links = require("./interactions/links");

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]});

client.on("ready", async () => {
    try {
        console.log("ig0r_sql is ready. :))))))))))))");
    } catch (error) {
        console.log(error);
    }
});

client.on('interactionCreate', async interaction => {
    console.time("interaction");
    try {
        if (interaction.type != InteractionType.ApplicationCommand) return;
        await interaction.deferReply();
        console.timeLog("interaction");

        const { commandName } = interaction;
        
        const userInfo = {
            name: interaction.member.nickname ? interaction.member.nickname : interaction.user.username, //use server nickname instead of global username when available
            id: interaction.user.id,
            dibs: interaction.options._hoistedOptions[0] ? interaction.options._hoistedOptions[0].value : undefined
        }

        const timeStamp = new Date();
        console.log(timeStamp.toLocaleString("de-DE")); //log time of interaction
        console.log(`${JSON.stringify(userInfo)} /${commandName}`); //log interaction info

        const db = await func.dbOpen();
        if (await func.checkRegistered(db, userInfo.id, userInfo.name)) {

            switch(commandName) { //command handling
                case "dojo":
                    await interaction.editReply({embeds: [await dojo(db)]});
                    console.timeEnd("interaction");
                    await db.close()
                    break;
                case "attend":
                    await interaction.editReply({embeds: [await attend(db, userInfo)]});
                    console.timeEnd("interaction");
                    await db.close()
                    break;
                case "unattend":
                    await interaction.editReply({embeds: [await unattend(db, userInfo)]});
                    console.timeEnd("interaction");
                    await db.close()
                    break;
                case "undibs":
                    await interaction.editReply({embeds: [await undibs(db, userInfo)]});
                    console.timeEnd("interaction");
                    await db.close()
                    break;
                case "events":
                    await interaction.editReply({embeds: [await events(db)]});
                    console.timeEnd("interaction");
                    await db.close()
                    break;
                case "links":
                    await interaction.editReply({embeds: [await links()]});
                    console.timeEnd("interaction");
                    await db.close()
                    break;
            }
        }
    } catch (error) {
        console.log(error);
    }
});

client.login(process.env.BOT_TOKEN); //Discord BOT login token
