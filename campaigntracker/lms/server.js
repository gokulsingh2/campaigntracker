const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

app.use(cors());
app.use(bodyParser.json());

/* Register */
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send("User Registered");
        }
    );
});

/* Login */
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=? AND password=?",
        [email, password],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.length > 0) {
                res.send(result[0]);
            } else {
                res.send("Invalid Credentials");
            }
        }
    );
});

/* Get Courses */
app.get('/courses', (req, res) => {
    db.query("SELECT * FROM courses", (err, result) => {
        res.send(result);
    });
});

/* Enroll */
app.post('/enroll', (req, res) => {
    const { user_id, course_id } = req.body;

    db.query(
        "INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)",
        [user_id, course_id],
        (err, result) => {
            res.send("Enrolled Successfully");
        }
    );
});

/* My Courses */
app.get('/mycourses/:id', (req, res) => {
    const userId = req.params.id;

    db.query(
        `SELECT courses.* FROM courses
         JOIN enrollments ON courses.id = enrollments.course_id
         WHERE enrollments.user_id=?`,
        [userId],
        (err, result) => {
            res.send(result);
        }
    );
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});