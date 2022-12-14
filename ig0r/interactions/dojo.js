const {EmbedBuilder} = require("discord.js");
const func = require("../functions/func");
const noEventRes = require("./noevent");

const possibleDibs = [
    "couch", 
    "smolcouch", 
    "bigcouch", 
    "matratze", 
    "feldbett1", 
    "feldbett2", 
    "feldbett3"
];

const dojo = async (db) => { // 📄📄📄📄📄📄📄📄📄 displays all information on current event
    // const db = await func.dbOpen();
    const nextEvent = await func.getNextEvent(db);
    const nextAttends = await func.getNextAttends(db);
    // console.log(await func.registerUser(db, discord_id));
    // console.log("checkreg: "+ JSON.stringify(await func.checkRegistered(db, discord_id, nick), null, 2));
    // await db.close();
    console.log(nextEvent);
    console.log(nextAttends);

    if (nextEvent) { //check if an event is found
        const eventDate = new Date(nextEvent.event_date);
        const eventDateString = eventDate.toLocaleDateString("de-DE", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        // const eventTimeString = eventDate.toLocaleTimeString("de-DE", {hour: '2-digit', minute:'2-digit'});
        
        var count = 0;
        const attList = nextAttends.map(x => {           
            if (x.discord_dibs) {
                count = count + 1;
                return  count.toString() + ". **" + x.discord_name + "** dibs **" + x.discord_dibs + "** :sleeping_accommodation:";
            } else {
                count = count + 1;
                return  count.toString() + ". **" + x.discord_name + "**";
            }     
        }).join("\n");

        function ifEmpty(x, y) {
            if (x.length === 0) {
                return y;
            } else {
                return x;
            }
        }

        function ifNotEmpty(x, y) {
            if (x.length !== 0) {
                return x + y;
            } else {
                return x;
            }
        }

        const takenDibs = nextAttends.map(x => {
            return x.discord_dibs;
        }).filter(x => x);

        const takenDibsList = takenDibs.map(x => {
            return "*~~" + x + "~~*";
        })

        var leftover = []; 
        possibleDibs.forEach(dib => {
            if (!takenDibs.includes(dib)) {
                leftover.push(dib);
            }
        });

        const dojoRes = new EmbedBuilder()
            .setColor("#0068b3")
            .setAuthor({name: "Insertgame", iconURL: "http://ig0r.insertgame.de/iglogo.png", url: "https://twitter.com/Insertgamedojo"})
            .setThumbnail(func.isValidHttpUrl(nextEvent.event_image) ? nextEvent.event_image : "http://ig0r.insertgame.de/sanwa.jpg")
            .setTitle(nextEvent.event_title + "")
            .setURL("http://www.insertgame.de")
            .setDescription(nextEvent.event_desc.length > 0 ? nextEvent.event_desc : "Keine Beschreibung :angry:")
            .addFields(
                {name: "Anmeldungen: " + nextAttends.length, value: ifEmpty(attList, "Noch keiner."), inline: false},
                {name: "Schlafplätze: " + leftover.length + "/" + possibleDibs.length + " frei", value: ifNotEmpty(takenDibsList.join(", "), ", ") + leftover.join(", "), inline: false}
            )
            .setFooter({text: "Geöffnet ab " + nextEvent.event_time + " Uhr am " + eventDateString});
        return dojoRes;
    } else {
        return noEventRes;
    }

}
module.exports = dojo;