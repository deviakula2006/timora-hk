const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith("http://localhost")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

const UserRoute = require("./routes/UserRoute");
const TasksRoute = require("./routes/TasksRoute");

const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB_KEY)
  .then(() => {
    console.log("DB is successfully connected");
  })
  .catch(() => {
    console.log("DB is not connected");
  });

app.use("/api/user", UserRoute);
app.use("/api/todo", TasksRoute);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Timora Backend Running Successfully 🚀");
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});