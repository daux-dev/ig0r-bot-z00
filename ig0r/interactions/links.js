const {MessageEmbed} = require("discord.js");

const links = async () => {
    const linksRes = new MessageEmbed()
            .setColor("#0068b3")
            .setTitle("Links")
            .setDescription("Unsere **[Homepage](https://insertgame.de)**!\nBesuche auch unseren **[Shop](https://shop.spreadshirt.de/Insertgame/)**.\nCheck die **[Anfahrt](http://www.insertgame.de/das-projekt/anfahrt)** und komm vorbei!");
    return linksRes;
}

module.exports = links;