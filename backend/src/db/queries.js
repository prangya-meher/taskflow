const db = require("./database");

// Query 1: Count tasks in each column
const taskCountByColumn = db.prepare(`
    SELECT
        c.id,
        c.name AS column_name,
        COUNT(t.id) AS task_count
    FROM columns c
    LEFT JOIN tasks t
        ON c.id = t.column_id
    GROUP BY c.id, c.name
    ORDER BY c.id
`).all();

console.log("\nTASK COUNT BY COLUMN:");
console.table(taskCountByColumn);


// Query 2: Get high-priority tasks
const highPriorityTasks = db.prepare(`
    SELECT
        t.id,
        t.title,
        t.priority,
        c.name AS column_name
    FROM tasks t
    INNER JOIN columns c
        ON t.column_id = c.id
    WHERE t.priority = ?
    ORDER BY t.created_at DESC
`).all("High");

console.log("\nHIGH PRIORITY TASKS:");
console.table(highPriorityTasks);


db.close();