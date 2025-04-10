require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Require the models
const pool = require("./Models/db");

const myAuthRouters = require("./Routes/AuthRouter");
const adminRouters = require("./Routes/AdminRouter");
const gameRouters =  require("./Routes/GameRouter")
const tournamentRouters = require("./Routes/TornamentRouter")
const tournamentParticipantsRouters = require("./Routes/TournamentparticipantRouter")
const matchRouters = require("./Routes/MatchRouter");
const scoreRoutes = require("./Routes/ScoresRouters")
const user = require("./Models/Admins");
const user2 = require("./Models/Users");
const userRoutes = require("./Routes/UserRouter");
// const myResumeRouters = require("./Routes/ResumeRouter");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/auth", myAuthRouters);
app.use("/admin", adminRouters);
app.use("/games", gameRouters);
app.use("/users", userRoutes);
app.use("/tournaments", tournamentRouters);
app.use("/matches", matchRouters);
app.use("/scores", scoreRoutes);
app.use("/participants", tournamentParticipantsRouters);
app.get('/admin-id/:username', user.getUserIdByUsername);
app.get('/user-id/:username', user2.getUserIdByUsername);

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