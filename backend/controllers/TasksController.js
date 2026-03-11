const Task = require("../models/Tasks");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

/* CREATE */
exports.createTask = async (req, res) => {
  try {
    const attachments = (req.files?.files || []).map(f => ({
      fileName: f.originalname,
      fileUrl: `/uploads/files/${f.filename}`,
      fileType: f.mimetype
    }));

    const recordings = (req.files?.audio || []).map(a => ({
      type: "audio",
      fileUrl: `/uploads/audio/${a.filename}`
    }));

   const task = await Task.create({
  title: req.body.title,
  description: req.body.description || "",
  isCompleted:
    req.body.isCompleted === true || req.body.isCompleted === "true",
  userId: req.user._id || req.user.id,
  attachments,
  recordings
});


    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json("Create failed");
  }
};

/* GET */
exports.getTodayTasks = async (req, res) => {
  try {
    const now = new Date();

    const start = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0, 0, 0, 0
    ));

    const end = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23, 59, 59, 999
    ));

    const tasks = await Task.find({
      userId: req.user._id || req.user.id,
      createdAt: { $gte: start, $lte: end }
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to fetch tasks");
  }
};


// get single tasks 
exports.getSingleTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id || req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch task" });
  }
};





/* UPDATE */
exports.UpdateData = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json("Not found");

    task.title = req.body.title;
    task.description = req.body.description || "";
    task.isCompleted = req.body.isCompleted === "true";

    const parse = v => {
      try { return JSON.parse(v); } catch { return []; }
    };

    const removedFiles = parse(req.body.removedFiles);
    const removedRecordings = parse(req.body.removedRecordings);

    removedFiles.forEach(f => {
      if (!f?.fileUrl) return;
      const p = path.join(__dirname, "..", f.fileUrl);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    });

    removedRecordings.forEach(r => {
      if (!r?.fileUrl) return;
      const p = path.join(__dirname, "..", r.fileUrl);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    });

    task.attachments = task.attachments.filter(
      f => !removedFiles.some(r => r.fileUrl === f.fileUrl)
    );

    task.recordings = task.recordings.filter(
      r => !removedRecordings.some(rr => rr.fileUrl === r.fileUrl)
    );

    (req.files?.files || []).forEach(f =>
      task.attachments.push({
        fileName: f.originalname,
        fileUrl: `/uploads/files/${f.filename}`,
        fileType: f.mimetype
      })
    );

    (req.files?.audio || []).forEach(a =>
      task.recordings.push({
        type: "audio",
        fileUrl: `/uploads/audio/${a.filename}`
      })
    );

    await task.save();
    res.json(task);
  } catch (e) {
    console.error(e);
    res.status(500).json("Update failed");
  }
};

/* TOGGLE */
exports.MarkCompleted = async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.isCompleted = !task.isCompleted;
  await task.save();
  res.json(task);
};

/* DELETE */
exports.DeleteData = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};


exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user._id || req.user.id
    }).sort({ createdAt: -1 });

    res.json(tasks);

  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching tasks");
  }
};


