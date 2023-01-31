require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

const dbOpen = async () => {
    try {
        const db = await sqlite.open({
            filename: "./db/z00.db",
            driver: sqlite3.Database
        });
        db ? db.get("PRAGMA foreign_keys = ON") : null;
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

const getApiEvents = async (db) => {
    try {
        return await db.all(`
            SELECT 
            events.event_title,
            events.event_desc,
            events.event_image,
            events.event_date,
            events.event_time
            FROM events WHERE event_date >= date('now') ORDER BY event_date
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

module.exports = {
    dbOpen,
    getUser,
    getNextEvent,
    getEventById,
    getAllEvents,
    getNextAttends,
    getComingEvents,
    getApiEvents,
    createEvent,
    editEvent,
    deleteEvent
}