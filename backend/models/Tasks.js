const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: String,

    isCompleted: {
      type: Boolean,
      default: false
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String
      }
    ],

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
  { timestamps: true }   // <-- IMPORTANT
);

module.exports = mongoose.model("Tasks", todoSchema);
