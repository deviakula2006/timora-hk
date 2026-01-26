const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    //  Task title (required)
    title: {
      type: String,
      required: true
    },

    //  Optional description
    description: {
      type: String
    },

    //  The day this task belongs to (always today's date)
    date: {
      type: Date,
      required: true,
      default: () => new Date()
    },

    //  Did the user finish this task today?
    isCompleted: {
      type: Boolean,
      default: false
    },

    //  Who owns this task
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    //  PDFs, images, Word files, etc
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String
      }
    ],

    //  Voice & video recordings (from MediaRecorder)
    recordings: [
      {
        type: {
          type: String,
          enum: ["audio", "video"]
        },
        fileUrl: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Tasks", todoSchema);
