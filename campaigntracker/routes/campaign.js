const express = require("express");
const router = express.Router();
const db = require("./db");

router.post("/create", (req, res) => {
  const { name, source, medium, budget, user_id } = req.body;

  db.query(
    "INSERT INTO campaigns (name, source, medium, budget, user_id) VALUES (?, ?, ?, ?, ?)",
    [name, source, medium, budget, user_id],
    (err, result) => {
      if (err) return res.send(err);
      res.send({ id: result.insertId });
    }
  );
});

module.exports = router;