const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  createTask,
  getTodayTasks,
  getTaskById,
  UpdateData,
  DeleteData,
  MarkCompleted
} = require("../controllers/TasksController");

// CREATE
router.post(
  "/",
  auth,
  upload.fields([
    { name: "files", maxCount: 10 },
    { name: "audio", maxCount: 3 }
  ]),
  createTask
);

// READ
router.get("/", auth, getTodayTasks);
router.get("/:id", auth, getTaskById);

// UPDATE
router.patch(
  "/:id",
  auth,
  upload.fields([
    { name: "files", maxCount: 10 },
    { name: "audio", maxCount: 3 }
  ]),
  UpdateData
);

// TOGGLE
router.patch("/complete/:id", auth, MarkCompleted);

// DELETE
router.delete("/:id", auth, DeleteData);

module.exports = router;
