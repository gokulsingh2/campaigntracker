-- Active: 1775224256417@@127.0.0.1@3306@mysql
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gokul@123',
    database: 'lms'
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

module.exports = db;