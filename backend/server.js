const express = require("express");
const app = express();
const cors = require("cors");

// Configure CORS to allow your frontend origin
app.use(
  cors({
    origin: (origin, callback) => {
      // allow all localhost ports
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
  .then(res => {
    console.log("DB is successfully connected");
  })
  .catch(err => {
    console.log("DB is not connected");
  });

app.use('/api/user', UserRoute);
app.use('/api/todo', TasksRoute);
app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  console.log("Request origin:", req.headers.origin);
  next();
});

app.listen(9000, () => {
  console.log("server started at port 9000");
});