const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../')));

app.use("/auth", require("./auth"));
app.use("/campaign", require("./campaign"));
app.use("/track", require("./track"));
app.use("/analytics", require("./analytics"));
app.use("/profile", require("./profile"));

// 404 Handler
app.use((req, res) => {
  if (req.originalUrl.startsWith("/auth") ||
      req.originalUrl.startsWith("/campaign") ||
      req.originalUrl.startsWith("/track") ||
      req.originalUrl.startsWith("/analytics") ||
      req.originalUrl.startsWith("/profile")) {
    return res.status(404).json({ message: "Route not found" });
  }
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));