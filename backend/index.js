require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Require the models
const pool = require("./Models/db");

const myAuthRouters = require("./Routes/AuthRouter");
const adminRouters = require("./Routes/AdminRouter");
const gameRouters =  require("./Routes/GameRouter")
// const myResumeRouters = require("./Routes/ResumeRouter");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/auth", myAuthRouters);
app.use("/admin", adminRouters);
app.use("/games", gameRouters);
// app.use("/output", express.static(path.join(__dirname, "output")));
// app.use("/resume", myResumeRouters);

// Test Route
app.get("/", (req, res) => {
  res.send("API is working with PostgreSQL!");
});

// Graceful shutdown
process.on('SIGINT', () => {
  pool.end().then(() => {
    console.log('Database pool has ended');
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});