const Task = require("../models/Tasks");

// Create task
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description || "",
      userId: req.user.id,
      date: new Date(),
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json("Error creating task");
  }
};

// Get today's tasks
exports.getTodayTasks = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      userId: req.user.id,
      date: { $gte: start, $lte: end },
    });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json("Failed to fetch tasks");
  }
};

// Update task
exports.UpdateData = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json("Update failed");
  }
};

// Mark completed
// Mark completed (TOGGLE)
exports.MarkCompleted = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json("Task not found");
    }

    //  REAL TOGGLE
    task.isCompleted = !task.isCompleted;

    await task.save();

    res.status(200).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to toggle task");
  }
};


// Delete task
exports.DeleteData = async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json("Delete failed");
  }
};
// Get single task (details page)
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json("Task not found");
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json("Failed to fetch task");
  }
};
