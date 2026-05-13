const express = require("express");
const router = express.Router();
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "fallback_dev_secret";

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

// Get profile
router.get("/", verifyToken, (req, res) => {
  db.query(
    "SELECT id, name, email, created_at FROM users WHERE id = ?",
    [req.userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.length === 0) return res.status(404).json({ message: "User not found" });
      res.json(result[0]);
    }
  );
});

// Update name
router.put("/update-name", verifyToken, (req, res) => {
  const { name } = req.body;
  if (!name || name.trim() === "")
    return res.status(400).json({ message: "Name is required" });

  db.query(
    "UPDATE users SET name = ? WHERE id = ?",
    [name.trim(), req.userId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Name updated successfully" });
    }
  );
});

// Update password
router.put("/update-password", verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: "All fields are required" });
  if (newPassword.length < 6)
    return res.status(400).json({ message: "New password must be at least 6 characters" });

  db.query("SELECT * FROM users WHERE id = ?", [req.userId], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "User not found" });

    const user = result[0];
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ message: "Current password is incorrect" });

    const hash = await bcrypt.hash(newPassword, 10);
    db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hash, req.userId],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Password updated successfully" });
      }
    );
  });
});

module.exports = router;