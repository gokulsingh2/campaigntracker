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
    err => {
      if (err) return res.send(err);
      res.send("Registered");
    }
  );
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email],
    async (err, result) => {
      if (result.length === 0) return res.send("User not found");

      const user = result[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) return res.send("Wrong password");

      const token = jwt.sign({ id: user.id }, SECRET);
      res.send({ token });
    });
});

module.exports = router;