const Database = require("better-sqlite3"); //loads our SQLite library.
const path = require("path");

const dbPath = process.env.DB_PATH || path.join(__dirname, "taskflow.db"); //Our database file will be inside the db folder.

const db = new Database(dbPath); //opens the database.

                                // If taskflow.db doesn't exist, SQLite will create it.

db.pragma("foreign_keys = ON");

module.exports = db;