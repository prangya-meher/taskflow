const fs = require("fs");
const path = require("path");
const db = require("./database");

const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");   //reads our:schema.sql file and stores it in the schema variable.

db.exec(schema); //sends all that SQL to SQLite.

console.log("Database schema created successfully.");

db.close();