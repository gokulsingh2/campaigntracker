const express = require("express");
const router = express.Router();
const db = require("./db");
const jwt = require("jsonwebtoken");

const SECRET = "secretkey";

// Middleware to verify token
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Create Campaign
router.post("/create", verifyToken, (req, res) => {
  const { name, source, medium, budget } = req.body;
  const user_id = req.userId;

  db.query(
    "INSERT INTO campaigns (name, source, medium, budget, user_id) VALUES (?, ?, ?, ?, ?)",
    [name, source, medium, budget, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId });
    }
  );
});

// Get All Campaigns for logged in user
router.get("/all", verifyToken, (req, res) => {
  const user_id = req.userId;
  db.query(
    "SELECT * FROM campaigns WHERE user_id = ?",
    [user_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
});

module.exports = router;