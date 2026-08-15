const db = require("../db/database");

const getBoard = (req, res) => {
    try {
        const board = db.prepare(`
            SELECT id, name
            FROM boards
            LIMIT 1
        `).get();

        if (!board) {
            return res.status(404).json({
                message: "Board not found"
            });
        }

        const columns = db.prepare(`
            SELECT id, name
            FROM columns
            WHERE board_id = ?
            ORDER BY id
        `).all(board.id);

        const getTasks = db.prepare(`
            SELECT
                id,
                title,
                description,
                priority,
                position,
                created_at
            FROM tasks
            WHERE column_id = ?
            ORDER BY position
        `);

        const columnsWithTasks = columns.map((column) => {
            return {
                ...column,
                tasks: getTasks.all(column.id)
            };
        });

        res.json({
            ...board,
            columns: columnsWithTasks
        });

    } catch (error) {
        console.error("Error fetching board:", error);

        res.status(500).json({
            message: "Failed to fetch board"
        });
    }
};

module.exports = {
    getBoard
};