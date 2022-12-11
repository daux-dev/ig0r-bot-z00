BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "users" (
	"user_id"	INTEGER UNIQUE,
	"discord_id"	TEXT UNIQUE,
	PRIMARY KEY("user_id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "overlords" (
	"id"	INTEGER UNIQUE,
	"lord"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "attends" (
	"attend_id"	INTEGER UNIQUE,
	"event_id"	INTEGER,
	"user_id"	INTEGER,
	"discord_name"	TEXT NOT NULL,
	"discord_dibs"	TEXT,
	PRIMARY KEY("attend_id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "users"("user_id"),
	FOREIGN KEY("event_id") REFERENCES "events"("event_id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "events" (
	"event_id"	INTEGER UNIQUE,
	"event_title"	INTEGER,
	"event_image"	INTEGER,
	"event_desc"	TEXT,
	"event_date"	TEXT UNIQUE,
	"event_time"	TEXT,
	PRIMARY KEY("event_id" AUTOINCREMENT)
);
CREATE VIEW nextEventInfo AS
SELECT 
attends.attend_id,
users.user_id,
users.discord_id,
attends.discord_name,
attends.discord_dibs,
events.event_id,
events.event_title,
events.event_image,
events.event_desc,
events.event_date,
events.event_time
FROM events 
INNER JOIN attends ON events.event_id = attends.event_id
INNER JOIN users ON attends.user_id = users.user_id 
WHERE events.event_id = (SELECT event_id FROM events WHERE events.event_date >= date('now','localtime') ORDER BY event_date LIMIT 1);
COMMIT;
