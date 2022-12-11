require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

const dbOpen = async () => {
    try {
        const db = await sqlite.open({
            filename: "./db/z00.db",
            driver: sqlite3.Database
        });
        db ? await db.get("PRAGMA foreign_keys = ON") : null;
        return db;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getUser = async (username) => {
    try {
        const db = await dbOpen();
        const result = await db.get("SELECT * FROM overlords WHERE lord = lower(?)", [username]);
        result ? await db.close() : console.log("error");
        return result;
    } catch (error) {
        console.log(error);
    }
}

const getNextEvent = async (db) => {
    try {
        return await db.get("SELECT * FROM events WHERE event_date >= date('now') ORDER BY event_date");
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getEventById = async (id) => {
    try {
        const db = await dbOpen();
        const result = await db.get("SELECT * FROM events WHERE event_id = ?", [id]);
        result ? await db.close() : console.log("error");
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getAllEvents = async () => {
    try {
        const db = await dbOpen();
        const result = await db.all("SELECT * FROM events ORDER BY event_date DESC"); 
        result ? await db.close() : console.log("error");
        return result;
    } catch (error) {
        console.log(error);
        return false;
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
            WHERE events.event_id = (SELECT event_id FROM events WHERE events.event_date >= date('now') ORDER BY event_date LIMIT 1)
        `);
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getComingEvents = async (db) => {
    try {
        return await db.all(`
            SELECT * FROM events WHERE event_date >= date('now') ORDER BY event_date
        `);
    } catch (error) {
        console.log(error);
    }
}

const createEvent = async (event) => {
    try {
        const db = await dbOpen();
        const result = await db.run(`
            INSERT INTO events (event_title, event_image, event_desc, event_date, event_time) VALUES (?, ?, ?, ?, ?)
        `,[event.title, event.image, event.desc, event.date, event.time]);
        result ? await db.close() : console.log("error");
        return result;
    } catch (error) {
        console.log(error);
    }
}

const editEvent = async (event) => {
    try {
        const db = await dbOpen();
        const result = await db.run(`
        UPDATE events 
        SET 
        event_title = :title, 
        event_image = :image,
        event_desc = :desc, 
        event_date = :date,
        event_time = :time
        WHERE event_id = :id
        `, {
            ":title": event.title,
            ":image": event.image,
            ":desc": event.desc,
            ":date": event.date,
            ":time": event.time,
            ":id": event.id
        });
        result ? await db.close() : console.log("error");
        return result;
    } catch (error) {
        console.log();
    }
}

const deleteEvent = async (eventId) => {
    try {
        const db = await dbOpen();
        const run = await db.run(`DELETE FROM events WHERE event_id = ?`, [eventId]);
        run ? await db.close() : console.log("error");
        return run;
    } catch (error) {
        console.log(error);
    }
}

/* ig0r functions */

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
    getUser,
    getNextEvent,
    getEventById,
    getAllEvents,
    getNextAttends,
    getComingEvents,
    createEvent,
    editEvent,
    deleteEvent,
    checkRegistered,
    isValidHttpUrl,
    checkAttendance,
    checkDibs,
    updateDibs,
    registerAttend,
    deleteAttend
}