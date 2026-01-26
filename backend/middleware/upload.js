const multer = require("multer");
const path = require("path");

// ---------- STORAGE CONFIG ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "audio") {
      cb(null, "uploads/audio");
    } else {
      cb(null, "uploads/files");
    }
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

// ---------- FILE FILTER (basic safety) ----------
const fileFilter = (req, file, cb) => {
  cb(null, true); // allow all for now
};

// ---------- MULTER INSTANCE ----------
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB max
  }
});

module.exports = upload;
