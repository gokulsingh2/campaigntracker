const express = require("express");
const router = express.Router();
const db = require("./db");

// Click
router.post("/click", (req, res) => {
  const { campaign_id, ip, device } = req.body;

  db.query(
    "INSERT INTO clicks (campaign_id, ip_address, device) VALUES (?, ?, ?)",
    [campaign_id, ip, device],
    err => {
      if (err) return res.send(err);
      res.send("Click tracked");
    }
  );
});

// Conversion
router.post("/conversion", (req, res) => {
  const { campaign_id, type, revenue } = req.body;

  db.query(
    "INSERT INTO conversions (campaign_id, conversion_type, revenue) VALUES (?, ?, ?)",
    [campaign_id, type, revenue],
    err => {
      if (err) return res.send(err);
      res.send("Conversion tracked");
    }
  );
});

module.exports = router;