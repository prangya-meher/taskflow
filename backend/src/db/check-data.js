// After seeding, let's check that the data actually went into SQLite.
const db = require("./database");

const boards = db.prepare(`
    SELECT * FROM boards
`).all();

const columns = db.prepare(`
    SELECT * FROM columns
`).all();

const tasks = db.prepare(`
    SELECT * FROM tasks
`).all();

console.log("\nBOARDS:");
console.table(boards);

console.log("\nCOLUMNS:");
console.table(columns);

console.log("\nTASKS:");
console.table(tasks);

db.close();