const express = require("express");
const router = express.Router();
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = "secretkey";

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hash],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Registered" });
    }
  );
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email],
    async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result || result.length === 0) return res.status(404).json({ message: "User not found" });

      const user = result[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: "Wrong password" });

      const token = jwt.sign({ id: user.id }, SECRET);
      res.json({ token });
    }
  );
});

module.exports = router;