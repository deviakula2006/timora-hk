const express = require("express");
const router = express.Router();

const TaskController = require("../controllers/TasksController");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// GET ALL TASKS (FOR CALENDAR)
router.get("/",auth, TaskController.getAllTasks);

// GET TODAY TASKS
// CREATE TASK
router.post(
  "/",
  auth,
  upload.fields([
    { name: "files", maxCount: 10 },
    { name: "audio", maxCount: 3 }
  ]),
  TaskController.createTask
);

router.get("/today", auth, TaskController.getTodayTasks);

// GET SINGLE TASK
router.get("/single/:id", auth, TaskController.getSingleTask);


// UPDATE TASK
router.patch(
  "/:id",
  auth,
  upload.fields([
    { name: "files", maxCount: 10 },
    { name: "audio", maxCount: 3 }
  ]),
  TaskController.UpdateData
);

// TOGGLE COMPLETE
router.patch(
  "/complete/:id",
  auth,
  TaskController.MarkCompleted
);

// DELETE TASK
router.delete(
  "/:id",
  auth,
  TaskController.DeleteData
);




module.exports = router;
