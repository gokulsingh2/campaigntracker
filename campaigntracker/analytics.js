const express = require("express");
const router = express.Router();
const db = require("./db");

router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.query(`
    SELECT 
      c.name,
      COUNT(DISTINCT cl.id) clicks,
      COUNT(DISTINCT cv.id) conversions,
      IFNULL(SUM(cv.revenue),0) revenue
    FROM campaigns c
    LEFT JOIN clicks cl ON c.id = cl.campaign_id
    LEFT JOIN conversions cv ON c.id = cv.campaign_id
    WHERE c.id = ?
  `, [id], (err, result) => {
    if (err) return res.send(err);
    res.send(result[0]);
  });
});

module.exports = router;