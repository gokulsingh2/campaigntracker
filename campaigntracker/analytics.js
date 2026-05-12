const express = require("express");
const router = express.Router();
const db = require("./db");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "fallback_dev_secret";

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

router.get("/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const user_id = req.userId;

  // Also verify this campaign belongs to the logged-in user
  db.query(`
    SELECT 
      c.name,
      COUNT(DISTINCT cl.id) AS clicks,
      COUNT(DISTINCT cv.id) AS conversions,
      IFNULL(SUM(cv.revenue), 0) AS revenue
    FROM campaigns c
    LEFT JOIN clicks cl ON c.id = cl.campaign_id
    LEFT JOIN conversions cv ON c.id = cv.campaign_id
    WHERE c.id = ? AND c.user_id = ?
  `, [id, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result[0] || !result[0].name)
      return res.status(404).json({ message: "Campaign not found or access denied" });
    res.json(result[0]);
  });
});

module.exports = router;