const {EmbedBuilder} = require("discord.js");

const links = async () => {
    const linksRes = new EmbedBuilder()
            .setColor("#0068b3")
            .setTitle("Links")
            .setDescription("Unsere **[Homepage](https://insertgame.de)**!\nBesuche auch unseren **[Shop](https://shop.spreadshirt.de/Insertgame/)**.");
    return linksRes;
}

module.exports = links;