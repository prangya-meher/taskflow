const db = require("../db/database");

const createTask = (req, res) => {
    try {
        const {
            column_id,
            title,
            description,
            priority
        } = req.body;

        // Validate title
        if (!title || title.trim() === "") {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        // Validate column
        if (!column_id) {
            return res.status(400).json({
                message: "Column ID is required"
            });
        }

        // Check that column exists
        const column = db.prepare(`
            SELECT id
            FROM columns
            WHERE id = ?
        `).get(column_id);

        if (!column) {
            return res.status(404).json({
                message: "Column not found"
            });
        }

        // Validate priority
        const validPriorities = ["Low", "Medium", "High"];

        const taskPriority = priority || "Medium";

        if (!validPriorities.includes(taskPriority)) {
            return res.status(400).json({
                message: "Priority must be Low, Medium, or High"
            });
        }

        // Find next position
        const lastTask = db.prepare(`
            SELECT MAX(position) AS maxPosition
            FROM tasks
            WHERE column_id = ?
        `).get(column_id);

        const position =
            lastTask.maxPosition === null
                ? 0
                : lastTask.maxPosition + 1;

        // Insert task
        const result = db.prepare(`
            INSERT INTO tasks (
                column_id,
                title,
                description,
                priority,
                position
            )
            VALUES (?, ?, ?, ?, ?)
        `).run(
            column_id,
            title.trim(),
            description || "",
            taskPriority,
            position
        );

        // Get newly created task
        const task = db.prepare(`
            SELECT
                id,
                column_id,
                title,
                description,
                priority,
                position,
                created_at
            FROM tasks
            WHERE id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json(task);

    } catch (error) {
        console.error("Error creating task:", error);

        res.status(500).json({
            message: "Failed to create task"
        });
    }
};

// update the task(to change title, desc, priority)
const updateTask = (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            priority
        } = req.body;

        // Check if task exists
        const existingTask = db.prepare(`
            SELECT *
            FROM tasks
            WHERE id = ?
        `).get(id);

        if (!existingTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Validate title
        if (!title || title.trim() === "") {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        // Validate priority
        const validPriorities = [
            "Low",
            "Medium",
            "High"
        ];

        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                message: "Priority must be Low, Medium, or High"
            });
        }

        // Update task
        db.prepare(`
            UPDATE tasks
            SET
                title = ?,
                description = ?,
                priority = ?
            WHERE id = ?
        `).run(
            title.trim(),
            description || "",
            priority,
            id
        );

        // Get updated task
        const updatedTask = db.prepare(`
            SELECT
                id,
                column_id,
                title,
                description,
                priority,
                position,
                created_at
            FROM tasks
            WHERE id = ?
        `).get(id);

        res.status(200).json(updatedTask);

    } catch (error) {
        console.error("Error updating task:", error);

        res.status(500).json({
            message: "Failed to update task"
        });
    }
};

// delete the task by id
const deleteTask = (req, res) => {
    try {
        const { id } = req.params;

        // Check if task exists
        const existingTask = db.prepare(`
            SELECT *
            FROM tasks
            WHERE id = ?
        `).get(id);

        if (!existingTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Delete task
        db.prepare(`
            DELETE FROM tasks
            WHERE id = ?
        `).run(id);

        res.status(200).json({
            message: "Task deleted successfully",
            id: Number(id)
        });

    } catch (error) {
        console.error("Error deleting task:", error);

        res.status(500).json({
            message: "Failed to delete task"
        });
    }
};

// move task
const moveTask = (req, res) => {
    try {
        const { id } = req.params;
        const { column_id, position } = req.body;

        // Check if task exists
        const task = db.prepare(`
            SELECT *
            FROM tasks
            WHERE id = ?
        `).get(id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Validate column_id
        if (!column_id) {
            return res.status(400).json({
                message: "Column ID is required"
            });
        }

        // Check if destination column exists
        const column = db.prepare(`
            SELECT id
            FROM columns
            WHERE id = ?
        `).get(column_id);

        if (!column) {
            return res.status(404).json({
                message: "Column not found"
            });
        }

        // Validate position
        if (position === undefined || position === null) {
            return res.status(400).json({
                message: "Position is required"
            });
        }

        if (!Number.isInteger(position) || position < 0) {
            return res.status(400).json({
                message: "Position must be a non-negative integer"
            });
        }

        // Get tasks in destination column
        const destinationTasks = db.prepare(`
            SELECT id, position
            FROM tasks
            WHERE column_id = ?
              AND id != ?
            ORDER BY position ASC
        `).all(column_id, id);

        // Make sure position is not greater than the number of tasks
        const newPosition = Math.min(
            position,
            destinationTasks.length
        );

        // Use a transaction so all position changes happen together
        const move = db.transaction(() => {

            // Remove task from its old column
            db.prepare(`
                UPDATE tasks
                SET position = position - 1
                WHERE column_id = ?
                  AND position > ?
            `).run(task.column_id, task.position);

            // Make space in destination column
            db.prepare(`
                UPDATE tasks
                SET position = position + 1
                WHERE column_id = ?
                  AND position >= ?
            `).run(column_id, newPosition);

            // Move task
            db.prepare(`
                UPDATE tasks
                SET
                    column_id = ?,
                    position = ?
                WHERE id = ?
            `).run(
                column_id,
                newPosition,
                id
            );
        });

        move();

        // Return updated task
        const updatedTask = db.prepare(`
            SELECT
                id,
                column_id,
                title,
                description,
                priority,
                position,
                created_at
            FROM tasks
            WHERE id = ?
        `).get(id);

        res.status(200).json(updatedTask);

    } catch (error) {
        console.error("Error moving task:", error);

        res.status(500).json({
            message: "Failed to move task"
        });
    }
};

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    moveTask
};