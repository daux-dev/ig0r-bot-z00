require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

const dbOpen = async () => {
    try {
        const db = await sqlite.open({
            filename: "./db/z00.db",
            driver: sqlite3.Database
        });
        return db;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getNextEvent = async (db) => {
    try {
        return await db.get("SELECT * FROM events WHERE end > date('now') ORDER BY end");
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getComingEvents = async (db) => {
    try {
        return await db.all(`
            SELECT * FROM events WHERE end > date('now') ORDER BY end LIMIT 4
        `);
    } catch (error) {
        console.log(error);
    }
}

const getNextAttends = async (db) => {
    try {
        return await db.all(`
            SELECT 
            attends.attend_id,
            users.user_id,
            users.discord_id,
            attends.discord_name,
            attends.discord_dibs
            FROM events 
            INNER JOIN attends ON events.event_id = attends.event_id
            INNER JOIN users ON attends.user_id = users.user_id 
            WHERE events.event_id = (SELECT event_id FROM events WHERE events.end > date('now') ORDER BY end LIMIT 1)
        `);
    } catch (error) {
        console.log(error);
        return false;
    }
}

const checkRegistered = async (db, discord_id, nick) => {
    try {
        const stmt = await db.prepare(`
            SELECT users.discord_id FROM users WHERE discord_id = @id
        `);
        const result = await stmt.get({"@id": discord_id});
        await stmt.finalize();
        if (result) {
            console.log(`USER ${nick} with ID of ${discord_id} is registered.`);
            return result;
        } else {
            console.log(`USER ${nick} with ID of ${discord_id} is NOT registered.`);
            return await registerUser(db, discord_id, nick);
        }
    } catch (error) {
        console.log(error);
    }
}

const registerUser = async (db, discord_id, nick) => {
    try {
        const result = await db.run(`
            INSERT INTO users (discord_id) VALUES (:id)`, {
            ":id": discord_id
        });
        if (result) {console.log(`REGISTERED USER ${nick} with ID of ${discord_id}.`)}  
        return result;
    } catch (error) {
        console.log(error);
    }
}

const updateDibs = async (db, dibs, attend_id) => {
    try {
        return await db.run(`
            UPDATE attends SET discord_dibs = ? WHERE attend_id = ?`, [dibs, attend_id]);
    } catch (error) {
        console.log(error);
    }
}

const registerAttend = async (db, event_id, userInfo) => {
    try {
        const userId = await getUserId(db, userInfo.id);
        console.log("!!!!!!!!!USER ID GET CHECK: " + JSON.stringify(userId, null, 2));
        return await db.run(`
            INSERT INTO attends 
            (event_id, user_id, discord_name, discord_dibs)
            VALUES (?,?,?,?)
            `, [event_id, userId, userInfo.name, userInfo.dibs]);
    } catch (error) {
        console.log(error);
        return false;
    }
}

const deleteAttend = async (db, attendId) => {
    try {
        return await db.run(`
            DELETE FROM attends WHERE attend_id = ?
        `, [attendId]);
    } catch (error) {
        console.log(error);
    }
}

const getUserId = async (db, discord_id) => {
    try {
        const result = await db.get(`
            SELECT user_id FROM users WHERE discord_id = ?
        `, [discord_id]);

        return result.user_id;
    } catch (error) {
        console.log(error);
    }
}

const checkAttendance = (userid, attends) => { //checks if user attends event
    try {
        if (attends.some(e => (e.discord_id === userid))) {
            return true; //attending
        } else {
            return false; //not attending
        }
    } catch (err) {
        console.error(err);
    }
}

const checkDibs = (userdibs, attends) => { //checks if dibs is taken
    try {
        if (userdibs) {
            if (attends.some(e => (e.discord_dibs === userdibs))) {
                return true; //dibs taken
            } else {
                return false; //dibs free
            }
        } else {
            return false; //return false if empty dibs
        }
    } catch (err) {
        console.error(err);
    }
}

function isValidHttpUrl(string) { // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url 🤭
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
  }

module.exports = {
    dbOpen, 
    getNextEvent, 
    getNextAttends, 
    getComingEvents,
    checkRegistered, 
    updateDibs, 
    registerAttend, 
    deleteAttend, 
    checkAttendance, 
    checkDibs, 
    isValidHttpUrl
}