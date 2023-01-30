BEGIN TRANSACTION;
DROP TABLE IF EXISTS "users";
CREATE TABLE IF NOT EXISTS "users" (
	"user_id"	INTEGER UNIQUE,
	"discord_id"	TEXT UNIQUE,
	PRIMARY KEY("user_id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "overlords";
CREATE TABLE IF NOT EXISTS "overlords" (
	"id"	INTEGER UNIQUE,
	"lord"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "attends";
CREATE TABLE IF NOT EXISTS "attends" (
	"attend_id"	INTEGER UNIQUE,
	"event_id"	INTEGER,
	"user_id"	INTEGER,
	"discord_name"	TEXT NOT NULL,
	"discord_dibs"	TEXT,
	FOREIGN KEY("user_id") REFERENCES "users"("user_id"),
	FOREIGN KEY("event_id") REFERENCES "events"("event_id") ON DELETE CASCADE,
	PRIMARY KEY("attend_id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "events";
CREATE TABLE IF NOT EXISTS "events" (
	"event_id"	INTEGER UNIQUE,
	"event_title"	INTEGER,
	"event_image"	INTEGER,
	"event_desc"	TEXT,
	"event_date"	TEXT UNIQUE,
	"event_time"	TEXT,
	PRIMARY KEY("event_id" AUTOINCREMENT)
);
DROP VIEW IF EXISTS "nextEventInfo";
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
DROP VIEW IF EXISTS "dibsData";
CREATE VIEW dibsData AS
SELECT
attends.discord_dibs,
COUNT(attends.discord_dibs) AS "count"
FROM
attends
INNER JOIN events ON attends.event_id = events.event_id
WHERE attends.discord_dibs != ""
GROUP BY
attends.discord_dibs
ORDER BY
COUNT(attends.discord_dibs) DESC;
DROP VIEW IF EXISTS "nextEvent";
CREATE VIEW nextEvent AS
SELECT 
* 
FROM 
events 
WHERE 
event_date >= date('now', 'localtime') 
ORDER BY event_date;
DROP VIEW IF EXISTS "userData";
CREATE VIEW userData AS
SELECT DISTINCT
users.user_id as id,
users.discord_id,
GROUP_CONCAT(DISTINCT attends.discord_name) AS nicknames,
COUNT(attends.attend_id) AS attend_count
FROM
users
INNER JOIN attends ON users.user_id = attends.user_id
GROUP BY users.user_id;
COMMIT;
