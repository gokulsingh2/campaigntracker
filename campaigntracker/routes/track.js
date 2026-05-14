const express = require("express");
const router = express.Router();
const db = require("./db");
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

// Click
router.post("/click", verifyToken, (req, res) => {
  const { campaign_id, ip, device } = req.body;

  if (!campaign_id) return res.status(400).json({ message: "campaign_id is required" });

  db.query("SELECT id FROM campaigns WHERE id = ? AND user_id = ?", [campaign_id, req.userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(403).json({ message: "Access denied" });

    db.query(
      "INSERT INTO clicks (campaign_id, ip_address, device) VALUES (?, ?, ?)",
      [campaign_id, ip, device],
      err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Click tracked" });
      }
    );
  });
});

// Conversion
router.post("/conversion", verifyToken, (req, res) => {
  const { campaign_id, type, revenue } = req.body;

  if (!campaign_id || !type) return res.status(400).json({ message: "campaign_id and type are required" });

  db.query("SELECT id FROM campaigns WHERE id = ? AND user_id = ?", [campaign_id, req.userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(403).json({ message: "Access denied" });

    db.query(
      "INSERT INTO conversions (campaign_id, conversion_type, revenue) VALUES (?, ?, ?)",
      [campaign_id, type, revenue || 0],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Conversion tracked" });
      }
    );
  });
});

module.exports = router;