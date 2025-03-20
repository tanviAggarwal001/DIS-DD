require("dotenv").config();
const express = require("express");
require("./Models/db"); 
require("./Models/Users"); 
const cors = require("cors");
const path = require("path");

const myAuthRouters = require("./Routes/AuthRouter");
// const myResumeRouters = require("./Routes/ResumeRouter");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/auth", myAuthRouters);
// app.use("/output", express.static(path.join(__dirname, "output")));
// app.use("/resume", myResumeRouters);

// Test Route
app.get("/", (req, res) => {
  res.send("API is working with MongoDB Atlas!");
});



app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost/${PORT}`);
});
