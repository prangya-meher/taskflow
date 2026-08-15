const db = require("./database");

console.log("Starting database seed...");

try {
    // Start a transaction
    // "Do all these database operations together."(If something goes wrong in the middle, the transaction can prevent us from ending up with half-created seed data.)
    const seed = db.transaction(() => {

        // Create the board
        const boardResult = db
            .prepare(`
                INSERT INTO boards (name)
                VALUES (?)
            `)
            .run("TaskFlow Board");

        const boardId = boardResult.lastInsertRowid;

        console.log(`Created board with ID: ${boardId}`);

        // Create columns
        const insertColumn = db.prepare(`
            INSERT INTO columns (board_id, name)
            VALUES (?, ?)
        `);

        const todoResult = insertColumn.run(boardId, "To Do");
        const inProgressResult = insertColumn.run(boardId, "In Progress");
        const doneResult = insertColumn.run(boardId, "Done");

        const todoId = todoResult.lastInsertRowid;
        const inProgressId = inProgressResult.lastInsertRowid;
        const doneId = doneResult.lastInsertRowid;

        console.log("Created columns.");

        // Create tasks
const insertTask = db.prepare(`
    INSERT INTO tasks (
        column_id,
        title,
        description,
        priority,
        position
    )
    VALUES (?, ?, ?, ?, ?)
`);

insertTask.run(
    todoId,
    "Build Navbar",
    "Create a responsive navigation bar.",
    "High",
    0
);

insertTask.run(
    todoId,
    "Create Homepage",
    "Build the main TaskFlow homepage.",
    "Medium",
    1
);

insertTask.run(
    inProgressId,
    "Create Backend API",
    "Build the Express API for tasks.",
    "High",
    0
);

insertTask.run(
    inProgressId,
    "Add Validation",
    "Add backend validation for task creation.",
    "Medium",
    1
);

insertTask.run(
    doneId,
    "Setup Database",
    "Create SQLite database and tables.",
    "Low",
    0
);

        console.log("Created tasks.");
    });

    // Execute the transaction
    seed();

    console.log("Database seeded successfully!");
} catch (error) {
    console.error("Error while seeding database:", error.message);
} finally {
    db.close();
}