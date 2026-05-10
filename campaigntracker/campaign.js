const express = require("express");
const router = express.Router();
const db = require("./db");

// Create Campaign
router.post("/create", (req, res) => {
  const { name, source, medium, budget, user_id } = req.body;

  db.query(
    "INSERT INTO campaigns (name, source, medium, budget, user_id) VALUES (?, ?, ?, ?, ?)",
    [name, source, medium, budget, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId });
    }
  );
});

// Get All Campaigns
router.get("/all", (req, res) => {
  db.query("SELECT * FROM campaigns", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

module.exports = router;