const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const TaskController = require("../controllers/TasksController");

// Create a new task
router.post("/", auth, TaskController.createTask);

// Get today's tasks
router.get("/", auth, TaskController.getTodayTasks);

// Update task title / description
router.patch("/:id", auth, TaskController.UpdateData);

// Mark task as completed
router.patch("/complete/:id", auth, TaskController.MarkCompleted);

// Delete task
router.delete("/:id", auth, TaskController.DeleteData);

// Get single task details
router.get("/:id", auth, TaskController.getTaskById);

module.exports = router;
