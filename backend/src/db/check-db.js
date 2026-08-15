const db = require("./database");

const tables = db
    .prepare(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
        ORDER BY name
    `)
    .all();

console.log("Tables in database:");
console.log(tables);

db.close();