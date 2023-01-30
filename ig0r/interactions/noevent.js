const {EmbedBuilder} = require("discord.js");

const noEventRes = new EmbedBuilder()
    .setColor("#e30511")
    .setTitle("Events / Termine")
    .setDescription("Keine Termine eingetragen.");

module.exports = noEventRes;