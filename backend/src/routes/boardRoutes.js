const express = require("express");

const router = express.Router();

const { getBoard } = require("../controllers/boardController");

// GET /api/board
router.get("/", getBoard);

module.exports = router;