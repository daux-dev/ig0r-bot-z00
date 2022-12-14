const {EmbedBuilder} = require("discord.js");
const func = require("../functions/func");
const noEventRes = require("./noevent");

const attend = async (db, userInfo) => {
    const nextEvent = await func.getNextEvent(db);
    const nextAttends = await func.getNextAttends(db);
    if (nextEvent) {
        const attending = func.checkAttendance(userInfo.id, nextAttends);
        const dibsTaken = func.checkDibs(userInfo.dibs, nextAttends);
        console.log(nextAttends);
        console.log(attending);
        console.log(dibsTaken);

        if (attending && userInfo.dibs && !dibsTaken) { //✅✅already attending but dibs will update
            const prevDibs = nextAttends.filter(user => user.discord_id === userInfo.id)[0].discord_dibs;
            const attendId = nextAttends.filter(user => user.discord_id === userInfo.id)[0].attend_id;
            console.log(attendId);
            console.log(`attending, dibs change from ${prevDibs} to ${userInfo.dibs}`);

            const result = await func.updateDibs(db, userInfo.dibs, attendId);

            console.log(result);

            if (result.changes == 1) {
                const botResponse = new EmbedBuilder()
                    .setColor("#009933")
                    .addFields({name: prevDibs ? "Dibs Wechsel" : "Dibs" , value: "**" + userInfo.name + "** " + (prevDibs ? "wechselt von **" + prevDibs + "**" : "hat dibs") + " auf **" + userInfo.dibs + "**."});
                return botResponse;    
            }

        } else if (attending && !userInfo.dibs) { //✅✅nothing will register (attending and no dibs)

            const botResponse = new EmbedBuilder()
                .setColor("#e30511")
                .addFields({name: "Bereits angemeldet", value: "Viel Spaß **" + userInfo.name + "**."});
            return botResponse;

        } else if (attending && dibsTaken) { //✅✅nothing will register (attending and dibs taken)

            const botResponse = new EmbedBuilder()
                .setColor("#e30511")
                .addFields({name: "Dibs vergeben", value: "Sorry **" + userInfo.name + "**,\n**" + userInfo.dibs + "** ist schon belegt!"});
            return botResponse;

        } else if (!attending && dibsTaken) { //✅✅user will register but dibs is already taken

            const oldDibs = userInfo.dibs;
            userInfo.dibs = "";
            const res = await func.registerAttend(db, nextEvent.event_id, userInfo);
            if (res) {
                const botResponse = new EmbedBuilder()
                    .setColor("#009933")
                    .addFields({name: "Neue Anmeldung", value: "**" + userInfo.name + "** wurde angemeldet!\n:no_entry: **" + oldDibs + "** ist aber schon vergeben!"});
                return botResponse;    
            }
            
        } else if (!attending && !dibsTaken) {  // ✅✅ user and dibs(if called) are registered

            const res = await func.registerAttend(db, nextEvent.event_id, userInfo);
            if (res) {
                const botResponse = new EmbedBuilder()
                    .setColor("#009933")
                    .addFields({name: "Neue Anmeldung", value: "**" + userInfo.name + "** wurde angemeldet" + (userInfo.dibs ? "!\nUnd hat dibs auf **" + userInfo.dibs + "**." : "!")});
                return botResponse;    
            }   

        }
    } else {
        return noEventRes;
    }
}

module.exports = attend;