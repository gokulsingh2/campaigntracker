const mysql = require("mysql2");

let db;

if (process.env.MYSQL_URL) {
  db = mysql.createConnection(process.env.MYSQL_URL);
} else {
  db = mysql.createConnection({
    host: process.env.MYSQLHOST || "localhost",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE || "campaign_tracker",
    port: process.env.MYSQLPORT || 3306
  });
}

db.connect(err => {
  if (err) {
    console.error("MySQL Error:", err);
    return;
  }
  console.log("MySQL Connected");
});

module.exports = db;