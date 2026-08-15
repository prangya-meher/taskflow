const express = require("express");

const router = express.Router();

const {
    createTask,
    updateTask,
    deleteTask,
    moveTask
} = require("../controllers/taskController");

router.post("/", createTask);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

router.put("/:id/move", moveTask);

module.exports = router;