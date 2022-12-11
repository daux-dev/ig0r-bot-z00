const {MessageEmbed} = require("discord.js");
const func = require("../functions/func");
const noEventRes = require("./noevent");

const unattend = async (db, userInfo) => { // ❌❌❌❌❌❌❌❌❌ unregister from next Event
    const nextEvent = await func.getNextEvent(db);
    const nextAttends = await func.getNextAttends(db);
    if (nextEvent) {
        const attending = func.checkAttendance(userInfo.id, nextAttends);
        if (attending) { //✅user is attending and will unregister
            const userAttendId = nextAttends.filter(user => user.discord_id === userInfo.id)[0].attend_id;
            const res = await func.deleteAttend(db, userAttendId);
            console.log(res);
            if (res) {
                const botResponse = new MessageEmbed()
                    .setColor("#e30511")
                    .addFields({name: "Abmeldung", value: "Schade **" + userInfo.name + "**."});
                return botResponse;    
            }
        } else { //❌user is not attending and therefore cannot unregister
            const botResponse = new MessageEmbed()
                .setColor("#e30511")
                .addFields({name: "Nicht angemeldet", value: "**" + userInfo.name + "** wie wärs mit **`/attend`** ?"});
            return botResponse;
        }
    } else {
        return noEventRes;
    }
}

module.exports = unattend;