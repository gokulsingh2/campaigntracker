const express = require("express");
const router = express.Router();
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResetEmail } = require("./mailer");

const SECRET = process.env.JWT_SECRET || "fallback_dev_secret";

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  db.query("SELECT id FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length > 0)
      return res.status(409).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hash],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Registered successfully" });
      }
    );
  });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result || result.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "7d" });
    res.json({ token });
  });
});

// Forgot Password
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "Email is required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "No account found with this email" });

    const user = result[0];

    // Create a reset token valid for 1 hour
    const resetToken = jwt.sign({ id: user.id }, SECRET + user.password, { expiresIn: "1h" });

    const resetLink = `https://web-production-ef9b1.up.railway.app/campaigntracker/reset.html?token=${resetToken}&id=${user.id}`;

    try {
      await sendResetEmail(user.email, resetLink);
      res.json({ message: "Reset email sent! Check your inbox." });
    } catch (err) {
      console.error("Email error:", err);
      res.status(500).json({ message: "Failed to send email. Try again." });
    }
  });
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  const { id, token, newPassword } = req.body;

  if (!id || !token || !newPassword)
    return res.status(400).json({ message: "All fields are required" });
  if (newPassword.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters" });

  db.query("SELECT * FROM users WHERE id = ?", [id], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = result[0];

    try {
      jwt.verify(token, SECRET + user.password);
    } catch {
      return res.status(401).json({ message: "Reset link is invalid or expired" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hash, user.id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Password reset successfully!" });
      }
    );
  });
});

module.exports = router;