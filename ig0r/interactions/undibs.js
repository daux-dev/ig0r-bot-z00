const {EmbedBuilder} = require("discord.js");
const func = require("../functions/func");
const noEventRes = require("./noevent");

const undibs = async (db, userInfo) => {
    
    const nextEvent = await func.getNextEvent(db);
    const nextAttends = await func.getNextAttends(db);
    const attending = func.checkAttendance(userInfo.id, nextAttends);

    if (nextEvent && attending) {
        const userHasDibs = nextAttends.filter(user => user.discord_id === userInfo.id)[0].discord_dibs;
        if (userHasDibs) {

            const prevDibs = nextAttends.filter(user => user.discord_id === userInfo.id);
            const userAttendId = nextAttends.filter(user => user.discord_id === userInfo.id)[0].attend_id;

            const res = await func.updateDibs(db, "", userAttendId);

            if (res) {
                const botResponse = new EmbedBuilder()
                    .setColor("#e30511")
                    .addFields({name: "Dibs zurückgezogen", value: "**" + userInfo.name + "** macht **" + prevDibs[0].discord_dibs + "** wieder frei."});
                return botResponse;
            }
            
        } else {
            const botResponse = new EmbedBuilder()
                .setColor("#e30511")
                .addFields({name: "Keine dibs", value: "**" + userInfo.name + "** hat keine dibs."});
            return botResponse;
        } 
    } else if (nextEvent && !attending) {
        const botResponse = new EmbedBuilder()
            .setColor("#e30511")
            .addFields({name: "Nicht angemeldet", value: "**" + userInfo.name + "** wie wärs mit **`/attend`** ?"});
        return botResponse;
    } else {
        return noEventRes;
    }
}

module.exports = undibs;