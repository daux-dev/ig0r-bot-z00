const {EmbedBuilder} = require("discord.js");
const func = require("../functions/func");
const noEventRes = require("./noevent");

const events = async (db) => {

    const comingEvents = await func.getComingEvents(db);
    console.log(comingEvents);
        if (comingEvents.length !== 0) {
            const eventList = comingEvents.map(event => {
                return "**" + event.event_title + "**\n" + event.event_time + " Uhr am " + new Date(event.event_date).toLocaleDateString("de-DE", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); //🤢🤢🤢
            }).join("\n\n");

            const eventsRes = new EmbedBuilder()
                .setColor("#0068b3")
                .setTitle("Events / Termine")
                .setDescription(eventList);
            return eventsRes;

        } else {
            return noEventRes;
        }
}

module.exports = events;