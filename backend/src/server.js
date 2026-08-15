const express = require("express");
const cors = require("cors");

const boardRoutes = require("./routes/boardRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "TaskFlow backend is running!"
    });
});

app.use("/api/board", boardRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`TaskFlow backend running on port ${PORT}`);
});